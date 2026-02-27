from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import HTTPException

from schemas.perfil import PerfilUpdateIn
from models.barbero import Barbero
from models.auth import LoginBarbero  

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def update_perfil(
    db: Session,
    barbero: Barbero,
    data: PerfilUpdateIn
):
    # -------------------------
    # BARBERO
    # -------------------------
    if data.nombre is not None:
        barbero.nombre = data.nombre

    if data.foto_url is not None:
        barbero.foto_url = data.foto_url

    # -------------------------
    # LOGIN
    # -------------------------
    if barbero.login and data.email is not None:
        barbero.login.email = data.email

    db.commit()
    db.refresh(barbero)
    return barbero


def change_password(
    db: Session,
    login: LoginBarbero,
    actual: str,
    nueva: str
):
    # 🔐 VALIDAR CONTRASEÑA ACTUAL
    if not pwd_context.verify(actual, login.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Contraseña actual incorrecta"
        )

    # 🔒 GUARDAR NUEVA CONTRASEÑA
    login.password_hash = pwd_context.hash(nueva)
    db.commit()
