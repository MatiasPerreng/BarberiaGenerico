from pydantic import BaseModel
import datetime


class DisponibilidadDiaOut(BaseModel):
    fecha: datetime.date
    estado: str  # 'disponible' | 'completo' | 'cerrado'


class DisponibilidadMesOut(BaseModel):
    dias: list[DisponibilidadDiaOut]
