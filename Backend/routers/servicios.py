from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid

from database import get_db
import crud.servicio as crud_servicio
from schemas import ServicioCreate, ServicioUpdate, ServicioOut

router = APIRouter(
    prefix="/servicios",
    tags=["Servicios"]
)

UPLOAD_DIR = "static/servicios"
os.makedirs(UPLOAD_DIR, exist_ok=True)

#----------------------------------------------------------------------------------------------------------------------

@router.get("/", response_model=List[ServicioOut])
def listar_servicios(db: Session = Depends(get_db)):
    return crud_servicio.get_servicios(db)

#----------------------------------------------------------------------------------------------------------------------

@router.get("/{servicio_id}", response_model=ServicioOut)
def obtener_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = crud_servicio.get_servicio_by_id(db, servicio_id)

    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    return servicio

#----------------------------------------------------------------------------------------------------------------------

@router.post("/", response_model=ServicioOut, status_code=status.HTTP_201_CREATED)
def crear_servicio(
    servicio_in: ServicioCreate,
    db: Session = Depends(get_db)
):
    return crud_servicio.create_servicio(db, servicio_in)

#----------------------------------------------------------------------------------------------------------------------

@router.put("/{servicio_id}", response_model=ServicioOut)
def actualizar_servicio(
    servicio_id: int,
    servicio_in: ServicioUpdate,
    db: Session = Depends(get_db)
):
    servicio = crud_servicio.get_servicio_by_id(db, servicio_id)

    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    return crud_servicio.update_servicio(db, servicio, servicio_in)

#----------------------------------------------------------------------------------------------------------------------
# 🔥 SUBIR / ACTUALIZAR IMAGEN
#----------------------------------------------------------------------------------------------------------------------

@router.post("/{servicio_id}/imagen", response_model=ServicioOut)
def subir_imagen_servicio(
    servicio_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    servicio = crud_servicio.get_servicio_by_id(db, servicio_id)

    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # 🔹 generar nombre único
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"

    # 🔹 guardar archivo en disco
    filepath = os.path.join("static", "servicios", filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔥 CLAVE: guardar SOLO el nombre
    servicio.imagen = filename

    db.commit()
    db.refresh(servicio)

    return servicio

#----------------------------------------------------------------------------------------------------------------------

@router.delete("/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = crud_servicio.get_servicio_by_id(db, servicio_id)

    if not servicio:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )

    try:
        crud_servicio.delete_servicio(db, servicio)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    return None
