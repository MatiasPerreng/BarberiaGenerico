from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BlacklistBase(BaseModel):
    telefono: str
    motivo: Optional[str] = None

class BlacklistCreate(BlacklistBase):
    """Lo que el frontend envía para bloquear un número"""
    pass

class BlacklistOut(BlacklistBase):
    """Lo que la API devuelve al consultar la lista"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 