from pydantic import BaseModel
from typing import Optional
from datetime import date, time


class HorarioExcepcionBase(BaseModel):
    fecha: date
    cerrado: bool = False
    hora_desde: Optional[time] = None
    hora_hasta: Optional[time] = None


class HorarioExcepcionCreate(HorarioExcepcionBase):
    id_barbero: int


class HorarioExcepcionOut(HorarioExcepcionBase):
    id_excepcion: int
    id_barbero: int

    class Config:
        from_attributes = True
