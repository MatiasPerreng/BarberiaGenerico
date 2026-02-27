from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from fastapi import HTTPException, status

from models import HorarioExcepcion
from schemas import (
    HorarioExcepcionCreate,
    HorarioExcepcionOut
)

# ----------------------------------------------------------------------------------------------------------------------
# CREAR EXCEPCIÓN
# ----------------------------------------------------------------------------------------------------------------------

def create_excepcion(
    db: Session,
    excepcion_in: HorarioExcepcionCreate
) -> HorarioExcepcion:

    # Regla: cierre no puede tener horas
    if excepcion_in.tipo == "cierre":
        if excepcion_in.hora_desde or excepcion_in.hora_hasta:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un cierre no puede tener horario"
            )

    # Regla: horario especial debe tener horas válidas
    if excepcion_in.tipo == "horario_especial":
        if not excepcion_in.hora_desde or not excepcion_in.hora_hasta:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El horario especial debe tener hora desde y hasta"
            )

        if excepcion_in.hora_desde >= excepcion_in.hora_hasta:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Hora desde debe ser menor que hora hasta"
            )

    # Regla: solo una excepción por barbero + fecha
    existe = (
        db.query(HorarioExcepcion)
        .filter(
            HorarioExcepcion.id_barbero == excepcion_in.id_barbero,
            HorarioExcepcion.fecha == excepcion_in.fecha
        )
        .first()
    )

    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una excepción para esa fecha"
        )

    excepcion = HorarioExcepcion(**excepcion_in.dict())

    db.add(excepcion)
    db.commit()
    db.refresh(excepcion)

    return excepcion


# ----------------------------------------------------------------------------------------------------------------------
# LISTAR EXCEPCIONES POR BARBERO
# ----------------------------------------------------------------------------------------------------------------------

def get_excepciones_barbero(
    db: Session,
    id_barbero: int
) -> List[HorarioExcepcion]:

    return (
        db.query(HorarioExcepcion)
        .filter(HorarioExcepcion.id_barbero == id_barbero)
        .order_by(HorarioExcepcion.fecha)
        .all()
    )


# ----------------------------------------------------------------------------------------------------------------------
# OBTENER EXCEPCIÓN PARA FECHA (CLAVE)
# ----------------------------------------------------------------------------------------------------------------------

def get_excepcion_para_fecha(
    db: Session,
    id_barbero: int,
    fecha: date
) -> Optional[HorarioExcepcion]:

    return (
        db.query(HorarioExcepcion)
        .filter(
            HorarioExcepcion.id_barbero == id_barbero,
            HorarioExcepcion.fecha == fecha
        )
        .first()
    )
