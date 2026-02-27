from pydantic import BaseModel
from typing import Optional
import datetime

class BarberoBase(BaseModel):
    nombre: str

class BarberoCreate(BarberoBase):
    pass

class BarberoUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None

# NUEVO: Para recibir el descanso
class BarberoDescansoUpdate(BaseModel):
    descanso_inicio: Optional[str] = None 
    descanso_fin: Optional[str] = None    

class BarberoOut(BarberoBase):
    id_barbero: int
    activo: bool
    foto_url: Optional[str] = None
    created_at: Optional[datetime.datetime]
    tiene_usuario: bool
    descanso_inicio: Optional[str] = None
    descanso_fin: Optional[str] = None

    class Config:
        from_attributes = True

class CrearCuentaBarberoIn(BaseModel):
    email: str
    password: str
    rol: str

class AgendaBarberoOut(BaseModel):
    fecha_hora: datetime.datetime
    cliente_nombre: str
    cliente_telefono: str
    servicio_nombre: str
    servicio_duracion: int
    estado: str