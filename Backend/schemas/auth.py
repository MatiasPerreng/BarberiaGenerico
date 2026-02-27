from pydantic import BaseModel, EmailStr
from typing import Literal


# ---------------------------------------------------------
# LOGIN
# ---------------------------------------------------------

class LoginBarberoIn(BaseModel):
    email: EmailStr
    password: str


class BarberoAuthOut(BaseModel):
    id_barbero: int
    nombre: str
    rol: str

    class Config:
        from_attributes = True


class LoginBarberoOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    barbero: BarberoAuthOut


# ---------------------------------------------------------
# ADMIN · CREAR CUENTA BARBERO
# ---------------------------------------------------------

class CrearCuentaBarberoIn(BaseModel):
    email: EmailStr
    password: str
    rol: Literal["admin", "barbero"]
