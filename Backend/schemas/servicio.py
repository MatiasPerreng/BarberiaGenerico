from pydantic import BaseModel
from typing import Optional
import decimal


class ServicioBase(BaseModel):
    nombre: str
    duracion_min: int
    precio: decimal.Decimal
    activo: Optional[bool] = True
    imagen: Optional[str] = None


class ServicioCreate(ServicioBase):
    pass


class ServicioUpdate(BaseModel):
    nombre: Optional[str] = None
    duracion_min: Optional[int] = None
    precio: Optional[decimal.Decimal] = None
    activo: Optional[bool] = None
    imagen: Optional[str] = None


class ServicioOut(ServicioBase):
    id_servicio: int

    class Config:
        from_attributes = True
