from pydantic import BaseModel, EmailStr
from typing import Optional


class PerfilOut(BaseModel):
    id_barbero: int
    nombre: str
    email: EmailStr
    foto_url: Optional[str] = None

    class Config:
        from_attributes = True


class PerfilUpdateIn(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    foto_url: Optional[str] = None


class ChangePasswordIn(BaseModel):
    actual: str
    nueva: str
