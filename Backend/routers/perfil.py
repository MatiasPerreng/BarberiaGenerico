from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from core.dependencias import get_current_login_barbero
from schemas.perfil import PerfilOut, PerfilUpdateIn, ChangePasswordIn
from crud.perfil import update_perfil, change_password

router = APIRouter(
    prefix="/perfil",
    tags=["Perfil"]
)


@router.get("/me", response_model=PerfilOut)
def get_mi_perfil(
    login=Depends(get_current_login_barbero)
):
    barbero = login.barbero

    return {
        "id_barbero": barbero.id_barbero,
        "nombre": barbero.nombre,
        "email": login.email,
        "foto_url": barbero.foto_url
    }


@router.put("/me", response_model=PerfilOut)
def update_mi_perfil(
    data: PerfilUpdateIn,
    db: Session = Depends(get_db),
    login=Depends(get_current_login_barbero)
):
    barbero = update_perfil(db, login.barbero, data)

    return {
        "id_barbero": barbero.id_barbero,
        "nombre": barbero.nombre,
        "email": login.email,
        "foto_url": barbero.foto_url
    }


@router.put("/me/password")
def change_my_password(
    data: ChangePasswordIn,
    db: Session = Depends(get_db),
    login=Depends(get_current_login_barbero)
):
    change_password(
        db=db,
        login=login,  
        actual=data.actual,
        nueva=data.nueva
    )

    return {"ok": True}
