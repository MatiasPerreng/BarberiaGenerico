from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from fastapi import HTTPException, status

from models import HorarioBarbero
from schemas import HorarioBarberoCreate


def existe_solapamiento(db: Session, horario_in: HorarioBarberoCreate) -> bool:
    return (
        db.query(HorarioBarbero)
        .filter(
            HorarioBarbero.id_barbero == horario_in.id_barbero,
            HorarioBarbero.dia_semana == horario_in.dia_semana,
            HorarioBarbero.fecha_desde <= horario_in.fecha_hasta,
            HorarioBarbero.fecha_hasta >= horario_in.fecha_desde,
            HorarioBarbero.hora_desde < horario_in.hora_hasta,
            HorarioBarbero.hora_hasta > horario_in.hora_desde,
        )
        .first()
        is not None
    )


def create_horario(
    db: Session,
    horario_in: HorarioBarberoCreate
) -> HorarioBarbero:

    if not horario_in.fecha_desde or not horario_in.fecha_hasta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe indicar fecha desde y fecha hasta"
        )

    if existe_solapamiento(db, horario_in):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El horario se solapa con otro ya existente"
        )

    horario = HorarioBarbero(
        id_barbero=horario_in.id_barbero,
        dia_semana=horario_in.dia_semana,
        hora_desde=horario_in.hora_desde,
        hora_hasta=horario_in.hora_hasta,
        fecha_desde=horario_in.fecha_desde,
        fecha_hasta=horario_in.fecha_hasta,
    )

    db.add(horario)
    db.commit()
    db.refresh(horario)

    return horario


def get_horarios(db: Session) -> List[HorarioBarbero]:
    return db.query(HorarioBarbero).all()


def get_horarios_by_barbero(
    db: Session,
    barbero_id: int
) -> List[HorarioBarbero]:
    return (
        db.query(HorarioBarbero)
        .filter(HorarioBarbero.id_barbero == barbero_id)
        .order_by(HorarioBarbero.dia_semana, HorarioBarbero.hora_desde)
        .all()
    )


def get_horario_by_id(
    db: Session,
    horario_id: int
) -> Optional[HorarioBarbero]:
    return (
        db.query(HorarioBarbero)
        .filter(HorarioBarbero.id_horario == horario_id)
        .first()
    )


def delete_horario(db: Session, horario: HorarioBarbero) -> None:
    db.delete(horario)
    db.commit()


def get_horarios_barbero_para_fecha(
    db: Session,
    id_barbero: int,
    dia_semana: int,
    fecha: date
) -> List[HorarioBarbero]:
    return (
        db.query(HorarioBarbero)
        .filter(
            HorarioBarbero.id_barbero == id_barbero,
            HorarioBarbero.dia_semana == dia_semana,
            HorarioBarbero.fecha_desde <= fecha,
            HorarioBarbero.fecha_hasta >= fecha,
        )
        .order_by(HorarioBarbero.hora_desde)
        .all()
    )
