from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime


class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None


class ClienteOut(ClienteBase):
    id_cliente: int
    created_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True
