from pydantic import BaseModel, model_validator
from typing import Optional
import datetime

# ----------------------------------------------------------------------------------------------------------------------
# HORARIO BASE
# ----------------------------------------------------------------------------------------------------------------------

class HorarioBarberoBase(BaseModel):
    dia_semana: int
    hora_desde: datetime.time
    hora_hasta: datetime.time
    fecha_desde: datetime.date
    fecha_hasta: datetime.date

    @model_validator(mode="after")
    def validar_fechas(self):
        if self.fecha_desde > self.fecha_hasta:
            raise ValueError("fecha_desde no puede ser mayor que fecha_hasta")
        return self


class HorarioBarberoCreate(HorarioBarberoBase):
    id_barbero: int


class HorarioBarberoUpdate(BaseModel):
    dia_semana: Optional[int] = None
    hora_desde: Optional[datetime.time] = None
    hora_hasta: Optional[datetime.time] = None
    fecha_desde: Optional[datetime.date] = None
    fecha_hasta: Optional[datetime.date] = None


class HorarioBarberoOut(HorarioBarberoBase):
    id_horario: int
    id_barbero: int

    class Config:
        from_attributes = True
