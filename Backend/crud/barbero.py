from sqlalchemy.orm import Session
from typing import List, Optional
import time
from datetime import datetime, timedelta

from models import Barbero, Visita, Cliente, Servicio
from schemas import BarberoCreate, BarberoUpdate

def serialize_barbero(barbero: Barbero) -> dict:
    foto = barbero.foto_url or "default.jpg"
    if not foto.startswith("/media/"):
        url_final = f"/media/barberos/{foto}"
    else:
        url_final = foto

    return {
        "id_barbero": barbero.id_barbero,
        "nombre": barbero.nombre,
        "activo": barbero.activo,
        "foto_url": f"{url_final}?t={int(time.time())}",
        "created_at": barbero.created_at,
        "tiene_usuario": barbero.login is not None,
        "descanso_inicio": barbero.descanso_inicio,
        "descanso_fin": barbero.descanso_fin
    }


def es_hora_descanso(hora_evaluar: str, inicio: Optional[str], fin: Optional[str]) -> bool:
    """ Comprueba si una hora (HH:MM) está dentro del rango de descanso """
    if not inicio or not fin:
        return False

    return inicio <= hora_evaluar < fin

def get_barberos(db: Session, solo_activos: bool = False) -> List[dict]:
    query = db.query(Barbero)
    if solo_activos:
        query = query.filter(Barbero.activo == True)
    barberos = query.order_by(Barbero.nombre).all()
    return [serialize_barbero(b) for b in barberos]

def get_barbero_by_id(db: Session, barbero_id: int) -> Optional[Barbero]:
    return db.query(Barbero).filter(Barbero.id_barbero == barbero_id).first()

def create_barbero(db: Session, barbero_in: BarberoCreate) -> Barbero:
    barbero = Barbero(
        nombre=barbero_in.nombre,
        activo=True,
        foto_url="default.jpg"
    )
    db.add(barbero)
    db.commit()
    db.refresh(barbero)
    return barbero

def update_barbero(db: Session, barbero: Barbero, barbero_in: BarberoUpdate) -> Barbero:
    if barbero_in.nombre is not None: barbero.nombre = barbero_in.nombre
    if barbero_in.activo is not None: barbero.activo = barbero_in.activo
    db.commit()
    db.refresh(barbero)
    return barbero

def update_descanso(db: Session, barbero: Barbero, inicio: str, fin: str) -> Barbero:
    barbero.descanso_inicio = inicio
    barbero.descanso_fin = fin
    db.commit()
    db.refresh(barbero)
    return barbero

def toggle_barbero_estado(db: Session, barbero: Barbero) -> Barbero:
    barbero.activo = not barbero.activo
    db.commit()
    db.refresh(barbero)
    return barbero

def delete_barbero(db: Session, barbero: Barbero) -> None:
    tiene_visitas_activas = db.query(Visita.id_visita).filter(
        Visita.id_barbero == barbero.id_barbero,
        Visita.estado != "CANCELADO"
    ).first()
    if tiene_visitas_activas:
        raise ValueError("BARBERO_CON_VISITAS")
    db.query(Visita).filter(Visita.id_barbero == barbero.id_barbero).delete()
    db.delete(barbero)
    db.commit()

def get_agenda_barbero(db: Session, barbero_id: int):
    return (
        db.query(
            Visita.fecha_hora.label("fecha_hora"),
            Cliente.nombre.label("cliente_nombre"),
            Cliente.telefono.label("cliente_telefono"),
            Servicio.nombre.label("servicio_nombre"),
            Servicio.duracion_min.label("servicio_duracion"),
            Visita.estado.label("estado"),
        )
        .join(Cliente, Cliente.id_cliente == Visita.id_cliente)
        .join(Servicio, Servicio.id_servicio == Visita.id_servicio)
        .filter(Visita.id_barbero == barbero_id)
        .order_by(Visita.fecha_hora)
        .all()
    )