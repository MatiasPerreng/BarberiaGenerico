from sqlalchemy.orm import Session
from typing import List, Optional

from models import Servicio, Visita
from schemas import ServicioCreate, ServicioUpdate


#----------------------------------------------------------------------------------------------------------------------

def create_servicio(
    db: Session,
    servicio_in: ServicioCreate
) -> Servicio:

    servicio = Servicio(
        nombre=servicio_in.nombre,
        duracion_min=servicio_in.duracion_min,
        precio=servicio_in.precio,
        activo=servicio_in.activo
    )

    db.add(servicio)
    db.commit()
    db.refresh(servicio)

    return servicio


def get_servicios(db: Session) -> List[Servicio]:
    return db.query(Servicio).all()


def get_servicio_by_id(
    db: Session,
    servicio_id: int
) -> Optional[Servicio]:

    return (
        db.query(Servicio)
        .filter(Servicio.id_servicio == servicio_id)
        .first()
    )


def update_servicio(
    db: Session,
    servicio: Servicio,
    servicio_in: ServicioUpdate
) -> Servicio:

    if servicio_in.nombre is not None:
        servicio.nombre = servicio_in.nombre

    if servicio_in.duracion_min is not None:
        servicio.duracion_min = servicio_in.duracion_min

    if servicio_in.precio is not None:
        servicio.precio = servicio_in.precio

    if servicio_in.activo is not None:
        servicio.activo = servicio_in.activo

    db.commit()
    db.refresh(servicio)

    return servicio


def delete_servicio(db: Session, servicio: Servicio) -> None:
    # 🔥 VALIDACIÓN: no borrar si hay visitas asociadas
    visitas_asociadas = (
        db.query(Visita)
        .filter(Visita.id_servicio == servicio.id_servicio)
        .count()
    )

    if visitas_asociadas > 0:
        raise ValueError(
            "No se puede eliminar el servicio porque tiene turnos asociados"
        )

    db.delete(servicio)
    db.commit()
