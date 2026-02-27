from pydantic import BaseModel
from typing import Optional, Literal
import datetime

# ----------------------------------------------------------------------------------------------------------------------
# VISITA BASE
# ----------------------------------------------------------------------------------------------------------------------

class VisitaBase(BaseModel):
    fecha_hora: datetime.datetime
    id_cliente: int
    id_barbero: int
    id_servicio: int


class VisitaCreate(VisitaBase):
    pass


# ----------------------------------------------------------------------------------------------------------------------
# UPDATE (ADMIN / BARBERO)
# ----------------------------------------------------------------------------------------------------------------------

class VisitaUpdate(BaseModel):
    fecha_hora: Optional[datetime.datetime] = None
    id_barbero: Optional[int] = None
    id_servicio: Optional[int] = None
    estado: Optional[Literal["reservado", "cancelado", "completado"]] = None


# ----------------------------------------------------------------------------------------------------------------------
# OUTPUT (AGENDA BARBERO / ADMIN / HISTORIAL)
# ----------------------------------------------------------------------------------------------------------------------

class VisitaOut(BaseModel):

    id_visita: int

    fecha_hora: datetime.datetime
    estado: Optional[str]
    created_at: Optional[datetime.datetime]

    cliente_nombre: str
    cliente_apellido: str
    cliente_telefono: Optional[str] = None

    servicio_nombre: str
    servicio_duracion: int

    # 🔥 CAMPOS QUE FALTABAN (FIX REAL)
    barbero_id: Optional[int] = None
    barbero_nombre: str = ""

    class Config:
        from_attributes = True
