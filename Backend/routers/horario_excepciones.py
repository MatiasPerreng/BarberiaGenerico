from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import HorarioExcepcionCreate, HorarioExcepcionOut
import crud.horarios_excepciones as crud

router = APIRouter(
    prefix="/horarios-excepciones",
    tags=["Horarios - Excepciones"]
)


@router.post("/", response_model=HorarioExcepcionOut)
def crear_excepcion(
    excepcion_in: HorarioExcepcionCreate,
    db: Session = Depends(get_db)
):
    return crud.create_excepcion(db, excepcion_in)


@router.get("/barbero/{id_barbero}", response_model=List[HorarioExcepcionOut])
def listar_excepciones(
    id_barbero: int,
    db: Session = Depends(get_db)
):
    return crud.get_excepciones_barbero(db, id_barbero)
