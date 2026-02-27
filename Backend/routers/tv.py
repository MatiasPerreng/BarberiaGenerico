from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta

from database import get_db
from models import Visita

router = APIRouter(prefix="/tv", tags=["TV"])

# ======================================================================================
# CONFIGURACIÓN DE HORA LOCAL (URUGUAY UTC-3)
# ======================================================================================

def obtener_ahora_local() -> datetime:
    """Calcula la hora de Uruguay basándose en UTC (Servidor - 3 horas)."""
    return datetime.utcnow() - timedelta(hours=3)

# ======================================================================================

DIAS_ES = {
    0: "Lun",
    1: "Mar",
    2: "Mié",
    3: "Jue",
    4: "Vie",
    5: "Sáb",
    6: "Dom",
}

@router.get("/agenda-estado")
def agenda_estado_tv(db: Session = Depends(get_db)):
    # Corregimos la hora actual para Uruguay
    ahora = obtener_ahora_local()
    hoy = ahora.date()

    # Inicio del día basado en la hora local
    inicio_dia = ahora.replace(hour=0, minute=0, second=0, microsecond=0)

    visitas = (
        db.query(Visita)
        .options(
            joinedload(Visita.barbero),
            joinedload(Visita.servicio),
            joinedload(Visita.cliente),
        )
        .filter(
            Visita.fecha_hora >= inicio_dia,
            Visita.estado != "cancelado",
        )
        .order_by(Visita.fecha_hora.asc())
        .all()
    )

    en_curso = []
    proximos = []

    for visita in visitas:
        inicio = visita.fecha_hora
        # Si no hay servicio asociado por error, evitamos el crash
        duracion = visita.servicio.duracion_min if visita.servicio else 30
        fin = inicio + timedelta(minutes=duracion)

        nombre_cliente = (
            f"{visita.cliente.nombre} {visita.cliente.apellido}"
            if (visita.cliente and visita.cliente.apellido)
            else (visita.cliente.nombre if visita.cliente else "Cliente")
        )

        # La comparación ahora es correcta porque 'ahora' es hora de Uruguay
        if inicio <= ahora < fin:
            en_curso.append({
                "barbero": visita.barbero.nombre if visita.barbero else "Barbero",
                "cliente": nombre_cliente,
                "servicio": visita.servicio.nombre if visita.servicio else "Servicio",
            })

        elif inicio > ahora:
            es_hoy = inicio.date() == hoy

            if es_hoy:
                fecha_texto = None
            else:
                dia = DIAS_ES[inicio.weekday()]
                fecha_texto = f"{dia} {inicio.strftime('%d/%m')}"

            proximos.append({
                "hora": inicio.strftime("%H:%M"),
                "fecha_texto": fecha_texto,
                "es_hoy": es_hoy,
                "cliente": nombre_cliente,
                "barbero": visita.barbero.nombre if visita.barbero else "Barbero",
                "servicio": visita.servicio.nombre if visita.servicio else "Servicio",
            })

    return {
        "en_curso": en_curso,
        "proximos": proximos,
    }