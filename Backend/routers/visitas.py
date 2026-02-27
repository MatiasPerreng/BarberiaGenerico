from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime, time, timedelta
from calendar import monthrange

from database import get_db
# Importaciones de modelos para la lógica de validación
from models.blacklist import Blacklist
from models import Cliente, Visita # Importamos Cliente para buscar el teléfono

# Importaciones directas de archivos para evitar círculos viciosos de inicialización
from schemas.visita import VisitaCreate, VisitaOut, VisitaUpdate
from core.dependencias import get_current_login_barbero
from core.email import enviar_email_confirmacion
from core.email_templates import (
    generar_email_confirmacion,
    generar_email_cancelacion,
)

# Servicios de WhatsApp
from services.whatsapp import enviar_recordatorio_whatsapp, enviar_cancelacion_whatsapp

router = APIRouter(
    prefix="/visitas",
    tags=["Visitas"]
)

# ======================================================================================
# CONFIGURACIÓN DE HORA LOCAL (URUGUAY UTC-3)
# ======================================================================================

def obtener_hoy_local() -> date:
    """Retorna la fecha actual de Uruguay (UTC-3) para evitar desfases del servidor."""
    return (datetime.utcnow() - timedelta(hours=3)).date()

# ======================================================================================
# SERIALIZADOR
# ======================================================================================

def visita_to_out(visita):
    if isinstance(visita, dict):
        return visita

    return {
        "id_visita": visita.id_visita,
        "fecha_hora": visita.fecha_hora,
        "created_at": getattr(visita, "created_at", None),
        "estado": visita.estado,

        "cliente_nombre": visita.cliente.nombre if visita.cliente else "",
        "cliente_apellido": visita.cliente.apellido if visita.cliente else "",
        "cliente_telefono": visita.cliente.telefono if visita.cliente else "",
        "servicio_nombre": visita.servicio.nombre if visita.servicio else "",
        "servicio_duracion": visita.servicio.duracion_min if visita.servicio else 0,

        "barbero_id": visita.barbero.id_barbero if visita.barbero else None,
        "barbero_nombre": visita.barbero.nombre if visita.barbero else "",
    }

# ======================================================================================
# MI AGENDA Y HISTORIAL
# ======================================================================================

@router.get("/mi-agenda", response_model=List[VisitaOut])
def mi_agenda(
    fecha: Optional[date] = None,
    login=Depends(get_current_login_barbero),
    db: Session = Depends(get_db)
):
    from crud import visita as crud_v
    crud_v.marcar_visitas_completadas(db)
    visitas = crud_v.get_visitas_by_barbero(db=db, barbero_id=login.barbero_id, fecha=fecha)
    return [visita_to_out(v) for v in visitas]

@router.get("/historial", response_model=List[VisitaOut])
def historial_agenda(
    fecha: Optional[date] = None,
    login=Depends(get_current_login_barbero),
    db: Session = Depends(get_db)
):
    from crud import visita as crud_v
    crud_v.marcar_visitas_completadas(db)
    if login.role == "admin":
        visitas = crud_v.get_visitas_completadas(db=db, fecha=fecha)
    else:
        visitas = crud_v.get_visitas_completadas_por_barbero(db=db, barbero_id=login.barbero_id, fecha=fecha)
    return [visita_to_out(v) for v in visitas]

# ======================================================================================
# DISPONIBILIDAD
# ======================================================================================

@router.get("/disponibilidad")
def obtener_disponibilidad(fecha: date, id_servicio: int, id_barbero: Optional[int] = None, db: Session = Depends(get_db)):
    from crud import visita as crud_v
    try:
        return crud_v.get_disponibilidad(db=db, fecha=fecha, id_servicio=id_servicio, id_barbero=id_barbero)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/disponibilidad-mes")
def disponibilidad_mes(mes: int, anio: int, id_servicio: int, id_barbero: int, db: Session = Depends(get_db)):
    from crud import horario as crud_h
    from crud import visita as crud_v
    hoy = obtener_hoy_local()
    _, last_day = monthrange(anio, mes)
    resultado = []
    for dia in range(1, last_day + 1):
        fecha_dia = date(anio, mes, dia)
        if fecha_dia < hoy:
            resultado.append({"fecha": fecha_dia.isoformat(), "estado": "pasado"})
            continue
        horarios = crud_h.get_horarios_barbero_para_fecha(db=db, id_barbero=id_barbero, dia_semana=fecha_dia.isoweekday(), fecha=fecha_dia)
        if not horarios:
            resultado.append({"fecha": fecha_dia.isoformat(), "estado": "sin_horario"})
            continue
        turnos = crud_v.get_disponibilidad(db=db, fecha=fecha_dia, id_servicio=id_servicio, id_barbero=id_barbero)
        estado = "disponible" if len(turnos["turnos"]) > 0 else "completo"
        resultado.append({"fecha": fecha_dia.isoformat(), "estado": estado})
    return resultado

# ======================================================================================
# CREAR VISITA (CORREGIDO PARA EVITAR EL ATTRIBUTE ERROR)
# ======================================================================================

@router.post("/", response_model=VisitaOut, status_code=status.HTTP_201_CREATED)
def crear_visita(
    visita_in: VisitaCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    from crud import visita as crud_v
    try:
        # 1. BUSCAR AL CLIENTE PARA OBTENER SU TELÉFONO (Esto evita el AttributeError)
        cliente = db.query(Cliente).filter(Cliente.id_cliente == visita_in.id_cliente).first()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

        # 2. VALIDACIÓN DE LISTA NEGRA
        if cliente.telefono:
            tel_limpio = "".join(filter(str.isdigit, cliente.telefono))
            bloqueado = db.query(Blacklist).filter(Blacklist.telefono == tel_limpio).first()
            
            if bloqueado:
                print(f"🚫 BLOQUEO: Intento de reserva de número bloqueado: {tel_limpio}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Lo sentimos, no es posible realizar la reserva con este número."
                )

        # 3. CREAR VISITA
        visita = crud_v.create_visita(db, visita_in)

        # 4. EMAIL DE CONFIRMACIÓN
        if visita.cliente and visita.cliente.email:
            background_tasks.add_task(
                enviar_email_confirmacion,
                visita.cliente.email,
                "✅ Turno confirmado - King Barber",
                generar_email_confirmacion(visita)
            )

        return visita_to_out(visita)

    except HTTPException as he:
        raise he
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ======================================================================================
# CANCELAR VISITA
# ======================================================================================

@router.post("/{visita_id}/cancelar", status_code=status.HTTP_200_OK)
def cancelar_visita(visita_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    from crud import visita as crud_v
    visita = crud_v.get_visita_by_id(db, visita_id)
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")

    visita.estado = "CANCELADO"
    db.commit()
    db.refresh(visita)

    # Notificaciones
    if visita.cliente and visita.cliente.email:
        background_tasks.add_task(enviar_email_confirmacion, visita.cliente.email, "❌ Turno cancelado", generar_email_cancelacion(visita))
    
    if visita.cliente and visita.cliente.telefono:
        background_tasks.add_task(
            enviar_cancelacion_whatsapp,
            telefono_cliente=visita.cliente.telefono,
            nombre_cliente=visita.cliente.nombre,
            servicio=visita.servicio.nombre if visita.servicio else "Servicio",
            fecha_hora_str=visita.fecha_hora.strftime("%d/%m a las %H:%M")
        )

    return {"ok": True}

# ======================================================================================
# OTROS (PATCH, GET BY ID, LISTAR)
# ======================================================================================

@router.patch("/{visita_id}/estado", response_model=VisitaOut)
def actualizar_estado_visita(visita_id: int, data: VisitaUpdate, db: Session = Depends(get_db)):
    from crud import visita as crud_v
    try:
        visita = crud_v.update_estado_visita(db, visita_id, data.estado)
        return visita_to_out(visita)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{visita_id}", response_model=VisitaOut)
def obtener_visita(visita_id: int, db: Session = Depends(get_db)):
    from crud import visita as crud_v
    visita = crud_v.get_visita_by_id(db, visita_id)
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    return visita_to_out(visita)

@router.get("/", response_model=List[VisitaOut])
def listar_visitas(db: Session = Depends(get_db)):
    from crud import visita as crud_v
    crud_v.marcar_visitas_completadas(db)
    # Suponiendo que tienes un método get_visitas general en crud
    visitas = db.query(Visita).all()
    return [visita_to_out(v) for v in visitas]