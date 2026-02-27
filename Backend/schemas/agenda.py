from pydantic import BaseModel
from typing import Optional
import datetime


class AgendaBarberoOut(BaseModel):
    fecha_hora: datetime.datetime
    cliente_nombre: str
    cliente_telefono: Optional[str]
    servicio_nombre: str
    servicio_duracion: int
    estado: Optional[str]

    class Config:
        from_attributes = True
