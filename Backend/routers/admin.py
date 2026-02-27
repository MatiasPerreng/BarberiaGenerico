from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date, time, timedelta
from zoneinfo import ZoneInfo
import logging

from database import get_db
from models import Visita, Barbero, Cliente, Servicio

from models.blacklist import Blacklist

from schemas.blacklist import BlacklistCreate, BlacklistOut

# Importamos el servicio para disparar el mensaje a Meta
from services.whatsapp import enviar_cancelacion_whatsapp

# Configuración de logs
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# --- CONFIGURACIÓN DE HORA URUGUAY ---
def get_now_uy():
    """Retorna el datetime actual de Uruguay (naive) para comparar en DB."""
    return datetime.now(ZoneInfo("America/Montevideo")).replace(tzinfo=None)

# =====================================================================================
# DASHBOARD - MÉTRICAS GENERALES
# =====================================================================================

@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
    ahora = get_now_uy()
    hoy = ahora.date()

    inicio_hoy = datetime.combine(hoy, time.min)
    fin_hoy = datetime.combine(hoy, time.max)

    barberos_activos = db.query(Barbero).filter(Barbero.activo == True).count()

    turnos_hoy = db.query(Visita).filter(
        Visita.estado.ilike("confirmado"),
        Visita.fecha_hora >= inicio_hoy,
        Visita.fecha_hora <= fin_hoy
    ).count()

    turnos_pendientes = db.query(Visita).filter(
        Visita.estado.ilike("confirmado"),
        Visita.fecha_hora > ahora
    ).count()

    turnos_cancelados = db.query(Visita).filter(
        Visita.estado.ilike("cancelado")
    ).count()

    return {
        "barberos_activos": barberos_activos,
        "turnos_hoy": turnos_hoy,
        "turnos_pendientes": turnos_pendientes,
        "turnos_cancelados": turnos_cancelados
    }

# =====================================================================================
# DASHBOARD - LISTADO DE TURNOS (CON FILTROS)
# =====================================================================================

@router.get("/turnos")
def admin_turnos(
    filtro: str = Query(..., regex="^(pendientes|hoy|cancelados)$"),
    fecha: date | None = None, 
    db: Session = Depends(get_db)
):
    ahora = get_now_uy()
    hoy = ahora.date()

    query = (
        db.query(Visita)
        .join(Cliente)
        .join(Servicio)
        .join(Barbero)
    )

    if fecha:
        inicio = datetime.combine(fecha, time.min)
        fin = datetime.combine(fecha, time.max)
        query = query.filter(Visita.fecha_hora >= inicio, Visita.fecha_hora <= fin)
    else:
        if filtro == "pendientes":
            query = query.filter(Visita.estado.ilike("confirmado"), Visita.fecha_hora > ahora)
        elif filtro == "hoy":
            inicio = datetime.combine(hoy, time.min)
            fin = datetime.combine(hoy, time.max)
            query = query.filter(Visita.estado.ilike("confirmado"), Visita.fecha_hora >= inicio, Visita.fecha_hora <= fin)
        elif filtro == "cancelados":
            query = query.filter(Visita.estado.ilike("cancelado"))

    if filtro == "pendientes":
        turnos = query.order_by(Visita.fecha_hora.asc()).all()
    else:
        turnos = query.order_by(Visita.fecha_hora.desc()).all()

    return [
        {
            "id_visita": t.id_visita,
            "fecha_hora": t.fecha_hora.strftime("%Y-%m-%d %H:%M"),
            "cliente_nombre": t.cliente.nombre,
            "cliente_apellido": t.cliente.apellido,
            "cliente_telefono": t.cliente.telefono,
            "servicio": t.servicio.nombre,
            "servicio_duracion": t.servicio.duracion_min,
            "barbero": t.barbero.nombre,
            "estado": t.estado.upper()
        }
        for t in turnos
    ]

# =====================================================================================
# GESTIÓN DE TURNOS - ACCIONES
# =====================================================================================

@router.patch("/turnos/{id_visita}/cancelar")
def cancelar_turno_admin(id_visita: int, db: Session = Depends(get_db)):
    # 1. Buscamos el turno con los joins necesarios
    turno = db.query(Visita).filter(Visita.id_visita == id_visita).first()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    
    # 2. Extraer datos ANTES del commit para asegurar disponibilidad
    nombre_cliente = turno.cliente.nombre
    telefono_cliente = turno.cliente.telefono
    nombre_servicio = turno.servicio.nombre
    # Formato ajustado a tu plantilla: "18/01 a las 15:00"
    fecha_msg = turno.fecha_hora.strftime("%d/%m a las %H:%M")
    
    # 3. Actualizamos la Base de Datos
    turno.estado = "cancelado"
    db.commit()
    
    # 4. Enviamos el WhatsApp (Corregido: coincidencia de nombres de argumentos)
    try:
        print(f"DEBUG: Intentando disparar WhatsApp de cancelación para {nombre_cliente}")
        enviar_cancelacion_whatsapp(
            telefono_cliente=telefono_cliente, # Coincide con whatsapp.py
            nombre_cliente=nombre_cliente,     # Coincide con whatsapp.py
            servicio=nombre_servicio,          # Coincide con whatsapp.py
            fecha_hora_str=fecha_msg           # Coincide con whatsapp.py
        )
    except Exception as e:
        logger.error(f"WhatsApp no enviado: {e}")
    
    return {"status": "success", "message": "Turno cancelado y cliente notificado"}

@router.patch("/turnos/{id_visita}/confirmar")
def confirmar_turno_admin(id_visita: int, db: Session = Depends(get_db)):
    turno = db.query(Visita).filter(Visita.id_visita == id_visita).first()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    
    turno.estado = "confirmado"
    db.commit()
    return {"status": "success", "message": "Turno confirmado"}

# =====================================================================================
# LISTADOS AUXILIARES
# =====================================================================================

@router.get("/barberos/listado")
def admin_listar_barberos(db: Session = Depends(get_db)):
    return db.query(Barbero).all()

@router.get("/servicios/listado")
def admin_listar_servicios(db: Session = Depends(get_db)):
    return db.query(Servicio).all()

# =====================================================================================
# GESTIÓN DE LISTA NEGRA (BLACKLIST)
# =====================================================================================

@router.get("/blacklist", response_model=List[BlacklistOut])
def listar_lista_negra(db: Session = Depends(get_db)):
    """Obtiene todos los números bloqueados."""
    return db.query(Blacklist).order_by(Blacklist.created_at.desc()).all()

@router.post("/blacklist", response_model=BlacklistOut)
def agregar_a_lista_negra(data: BlacklistCreate, db: Session = Depends(get_db)):
    """Bloquea un número de teléfono."""
    # Limpieza básica del número (solo dígitos)
    tel_limpio = "".join(filter(str.isdigit, data.telefono))
    
    # Verificamos si ya existe para no duplicar
    existe = db.query(Blacklist).filter(Blacklist.telefono == tel_limpio).first()
    if existe:
        raise HTTPException(status_code=400, detail="Este número ya se encuentra en la lista negra")
        
    nuevo_bloqueo = Blacklist(
        telefono=tel_limpio,
        motivo=data.motivo
    )
    
    db.add(nuevo_bloqueo)
    db.commit()
    db.refresh(nuevo_bloqueo)
    return nuevo_bloqueo

@router.delete("/blacklist/{id_blacklist}")
def eliminar_de_lista_negra(id_blacklist: int, db: Session = Depends(get_db)):
    """Desbloquea un número de la lista negra."""
    item = db.query(Blacklist).filter(Blacklist.id == id_blacklist).first()
    if not item:
        raise HTTPException(status_code=404, detail="El registro no existe")
    
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Número desbloqueado correctamente"}