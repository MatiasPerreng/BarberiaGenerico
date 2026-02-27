from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import crud.cliente as crud_cliente
from schemas import ClienteCreate, ClienteUpdate, ClienteOut


router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

#----------------------------------------------------------------------------------------------------------------------

@router.get("/", response_model=List[ClienteOut])
def listar_clientes(db: Session = Depends(get_db)):
    return crud_cliente.get_clientes(db)

#----------------------------------------------------------------------------------------------------------------------

@router.get("/{cliente_id}", response_model=ClienteOut)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = crud_cliente.get_cliente_by_id(db, cliente_id)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    return cliente

#----------------------------------------------------------------------------------------------------------------------

@router.post(
    "/",
    response_model=ClienteOut,
    status_code=status.HTTP_201_CREATED
)
def crear_cliente(
    cliente_in: ClienteCreate,
    db: Session = Depends(get_db)
):
    return crud_cliente.create_cliente(db, cliente_in)

#----------------------------------------------------------------------------------------------------------------------

@router.put("/{cliente_id}", response_model=ClienteOut)
def actualizar_cliente(
    cliente_id: int,
    cliente_in: ClienteUpdate,
    db: Session = Depends(get_db)
):
    cliente = crud_cliente.get_cliente_by_id(db, cliente_id)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    return crud_cliente.update_cliente(db, cliente, cliente_in)

#----------------------------------------------------------------------------------------------------------------------

@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = crud_cliente.get_cliente_by_id(db, cliente_id)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    crud_cliente.delete_cliente(db, cliente)
    return None
