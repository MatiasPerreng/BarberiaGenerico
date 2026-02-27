from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
import shutil
import time

from database import get_db
import crud.barbero as crud_barbero

from models import LoginBarbero
from schemas import (
    BarberoCreate,
    BarberoUpdate,
    BarberoOut,
    AgendaBarberoOut,
    CrearCuentaBarberoIn,
    BarberoDescansoUpdate
)

from core.dependencias import get_current_login_barbero
from core.security import hash_password

router = APIRouter(
    prefix="/barberos",
    tags=["Barberos"]
)

MEDIA_DIR = Path("static/barberos")

# ---------------------------------------------------------
# AGENDA BARBERO
# ---------------------------------------------------------

@router.get("/mi-agenda", response_model=List[AgendaBarberoOut])
def mi_agenda(
    login=Depends(get_current_login_barbero),
    db: Session = Depends(get_db),
):
    if login.role != "barbero" or not login.barbero_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este usuario no tiene agenda"
        )

    return crud_barbero.get_agenda_barbero(
        db,
        barbero_id=login.barbero_id
    )

# ---------------------------------------------------------
# PÚBLICO
# ---------------------------------------------------------

@router.get("/", response_model=List[BarberoOut])
def listar_barberos(db: Session = Depends(get_db)):
    return crud_barbero.get_barberos(db)

@router.get("/activos", response_model=List[BarberoOut])
def listar_barberos_activos(db: Session = Depends(get_db)):
    return crud_barbero.get_barberos(db, solo_activos=True)

@router.get("/{barbero_id}", response_model=BarberoOut)
def obtener_barbero(barbero_id: int, db: Session = Depends(get_db)):
    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")
    return crud_barbero.serialize_barbero(barbero)

# ---------------------------------------------------------
# ADMIN & DESCANSO
# ---------------------------------------------------------

@router.post("/", response_model=BarberoOut, status_code=status.HTTP_201_CREATED)
def crear_barbero(
    barbero_in: BarberoCreate,
    db: Session = Depends(get_db),
):
    barbero = crud_barbero.create_barbero(db, barbero_in)
    return crud_barbero.serialize_barbero(barbero)

@router.put("/{barbero_id}", response_model=BarberoOut)
def actualizar_barbero(
    barbero_id: int,
    barbero_in: BarberoUpdate,
    db: Session = Depends(get_db),
):
    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    barbero = crud_barbero.update_barbero(db, barbero, barbero_in)
    return crud_barbero.serialize_barbero(barbero)

@router.put("/{barbero_id}/descanso", response_model=BarberoOut)
def asignar_descanso(
    barbero_id: int,
    data: BarberoDescansoUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_login_barbero),
):
    if admin.role != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    barbero = crud_barbero.update_descanso(db, barbero, data.descanso_inicio, data.descanso_fin)
    return crud_barbero.serialize_barbero(barbero)

@router.patch("/{barbero_id}/toggle", response_model=BarberoOut)
def toggle_barbero(barbero_id: int, db: Session = Depends(get_db)):
    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    barbero = crud_barbero.toggle_barbero_estado(db, barbero)
    return crud_barbero.serialize_barbero(barbero)

# ==============================================================================
# ELIMINACIÓN CON PROTECCIÓN DE IDENTIDAD 🔥
# ==============================================================================
@router.delete("/{barbero_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_barbero(
    barbero_id: int, 
    db: Session = Depends(get_db),
    admin=Depends(get_current_login_barbero) # Identificamos quién hace la petición
):
    # SEGURIDAD: No permitir que el admin logueado se elimine a sí mismo
    if admin.barbero_id == barbero_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PROTECCIÓN DE CUENTA: No puedes eliminar tu propia cuenta de barbero administrador."
        )

    # SEGURIDAD: Solo el admin puede eliminar
    if admin.role != "admin":
        raise HTTPException(status_code=403, detail="No tienes permisos para eliminar barberos")

    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    try:
        crud_barbero.delete_barbero(db, barbero)
    except ValueError as e:
        if str(e) == "BARBERO_CON_VISITAS":
            raise HTTPException(
                status_code=400,
                detail="No se puede eliminar un barbero con visitas asociadas"
            )
        raise

    return None

# ---------------------------------------------------------
# CREAR ACCESO PARA BARBERO
# ---------------------------------------------------------

@router.post("/{barbero_id}/crear-acceso", status_code=status.HTTP_201_CREATED)
def crear_acceso_barbero(
    barbero_id: int,
    data: CrearCuentaBarberoIn,
    db: Session = Depends(get_db),
    admin=Depends(get_current_login_barbero),
):
    if admin.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )

    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    existe = (
        db.query(LoginBarbero)
        .filter(LoginBarbero.barbero_id == barbero_id)
        .first()
    )
    if existe:
        raise HTTPException(
            status_code=400,
            detail="El barbero ya tiene acceso"
        )

    login = LoginBarbero(
        nombre=barbero.nombre,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.rol,
        barbero_id=barbero_id,
        is_active=True
    )

    db.add(login)
    db.commit()
    db.refresh(login)

    return {"ok": True}

# ---------------------------------------------------------
# SUBIR FOTO BARBERO
# ---------------------------------------------------------

@router.post("/{barbero_id}/foto", response_model=BarberoOut) 
def subir_foto_barbero(
    barbero_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    barbero = crud_barbero.get_barbero_by_id(db, barbero_id)
    if not barbero:
        raise HTTPException(404, "Barbero no encontrado")

    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    
    if barbero.foto_url and barbero.foto_url != "default.jpg":
        old_path = MEDIA_DIR / barbero.foto_url
        if old_path.exists():
            old_path.unlink()

    timestamp = int(time.time())
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"barbero_{barbero_id}_{timestamp}{ext}" 
    filepath = MEDIA_DIR / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    barbero.foto_url = filename
    db.commit()

    return crud_barbero.serialize_barbero(barbero)