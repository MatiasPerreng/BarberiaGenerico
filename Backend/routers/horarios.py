from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import crud.horario as crud_horario
from schemas import HorarioBarberoCreate, HorarioBarberoOut


router = APIRouter(
    prefix="/horarios",
    tags=["Horarios"]
)

#----------------------------------------------------------------------------------------------------------------------

@router.get("/", response_model=List[HorarioBarberoOut])
def listar_horarios(db: Session = Depends(get_db)):
    return crud_horario.get_horarios(db)

#----------------------------------------------------------------------------------------------------------------------

@router.get(
    "/barbero/{barbero_id}",
    response_model=List[HorarioBarberoOut]
)
def listar_horarios_por_barbero(
    barbero_id: int,
    db: Session = Depends(get_db)
):
    return crud_horario.get_horarios_by_barbero(db, barbero_id)

#----------------------------------------------------------------------------------------------------------------------

@router.post(
    "/",
    response_model=HorarioBarberoOut,
    status_code=status.HTTP_201_CREATED
)
def crear_horario(
    horario_in: HorarioBarberoCreate,
    db: Session = Depends(get_db)
):
    return crud_horario.create_horario(db, horario_in)

#----------------------------------------------------------------------------------------------------------------------

@router.delete("/{horario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_horario(horario_id: int, db: Session = Depends(get_db)):
    horario = crud_horario.get_horario_by_id(db, horario_id)

    if not horario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horario no encontrado"
        )

    crud_horario.delete_horario(db, horario)
    return None
