from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import shutil
import uuid

from database import get_db
from core.dependencias import get_current_admin
import crud.servicio as crud_servicio
from schemas import ServicioCreate, ServicioUpdate, ServicioOut

router = APIRouter(
    prefix="/servicios",
    tags=["Servicios"]
)

_BACKEND_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = _BACKEND_DIR / "static" / "servicios"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

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
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return crud_servicio.create_servicio(db, servicio_in)

#----------------------------------------------------------------------------------------------------------------------

@router.put("/{servicio_id}", response_model=ServicioOut)
def actualizar_servicio(
    servicio_id: int,
    servicio_in: ServicioUpdate,
    admin=Depends(get_current_admin),
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
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    servicio = crud_servicio.get_servicio_by_id(db, servicio_id)

    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")

    content = file.file.read()
    file.file.seek(0)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Archivo demasiado grande (máx. 5 MB)")

    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    servicio.imagen = filename

    db.commit()
    db.refresh(servicio)

    return servicio

#----------------------------------------------------------------------------------------------------------------------

@router.delete("/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    servicio_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
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
