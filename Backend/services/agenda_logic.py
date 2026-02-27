from datetime import date, time
from typing import Optional, Tuple, List, Union
from sqlalchemy.orm import Session

from crud.horarios import get_horarios_barbero_para_fecha
from crud.horarios_excepcion import get_excepcion_para_fecha
from models import HorarioBarbero

HorarioEspecial = Tuple[time, time]
ResultadoHorario = Tuple[str, Union[List[HorarioBarbero], List[HorarioEspecial]]]


def obtener_horario_aplicable(
    db: Session,
    id_barbero: int,
    fecha: date
) -> Optional[ResultadoHorario]:
    """
    Devuelve:
    - None → día cerrado
    - ("especial", [(hora_desde, hora_hasta)])
    - ("base", [HorarioBarbero, ...])
    """

    excepcion = get_excepcion_para_fecha(db, id_barbero, fecha)

    # 1️⃣ Excepción
    if excepcion:
        if excepcion.tipo == "cierre":
            return None

        return (
            "especial",
            [(excepcion.hora_desde, excepcion.hora_hasta)]
        )

    # 2️⃣ Horario base
    dia_semana = fecha.isoweekday()  # 1 = lunes, 7 = domingo

    horarios = get_horarios_barbero_para_fecha(
        db=db,
        id_barbero=id_barbero,
        dia_semana=dia_semana,
        fecha=fecha
    )

    if not horarios:
        return None

    return ("base", horarios)

