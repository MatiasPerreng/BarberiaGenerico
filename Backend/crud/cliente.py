from sqlalchemy.orm import Session
from typing import List, Optional

from models import Cliente
from schemas import ClienteCreate, ClienteUpdate


# ----------------------------------------------------------------------------------------------------------------------
# CREAR O REUTILIZAR CLIENTE (🔥 CLAVE DEL SISTEMA 🔥)
# ----------------------------------------------------------------------------------------------------------------------

def get_or_create_cliente(db: Session, cliente_in: ClienteCreate) -> Cliente:
    """
    Busca cliente por teléfono.
    Si existe, lo reutiliza.
    Si no existe, lo crea.
    """

    cliente = (
        db.query(Cliente)
        .filter(Cliente.telefono == cliente_in.telefono)
        .first()
    )

    if cliente:
        # 🔁 Opcional: actualizar datos si vinieron nuevos
        actualizado = False

        if cliente_in.nombre and cliente.nombre != cliente_in.nombre:
            cliente.nombre = cliente_in.nombre
            actualizado = True

        if cliente_in.apellido and cliente.apellido != cliente_in.apellido:
            cliente.apellido = cliente_in.apellido
            actualizado = True

        if cliente_in.email and cliente.email != cliente_in.email:
            cliente.email = cliente_in.email
            actualizado = True

        if actualizado:
            db.commit()
            db.refresh(cliente)

        return cliente

    # 🆕 Crear cliente nuevo
    cliente = Cliente(
        nombre=cliente_in.nombre,
        apellido=cliente_in.apellido,
        telefono=cliente_in.telefono,
        email=cliente_in.email
    )

    db.add(cliente)
    db.commit()
    db.refresh(cliente)

    return cliente


# ----------------------------------------------------------------------------------------------------------------------
# CREATE (compatibilidad / uso manual)
# ----------------------------------------------------------------------------------------------------------------------

def create_cliente(db: Session, cliente_in: ClienteCreate) -> Cliente:
    """
    ⚠️ Mantengo esta función por compatibilidad,
    pero internamente usa get_or_create_cliente
    para evitar duplicados.
    """
    return get_or_create_cliente(db, cliente_in)


# ----------------------------------------------------------------------------------------------------------------------
# READ
# ----------------------------------------------------------------------------------------------------------------------

def get_clientes(db: Session) -> List[Cliente]:
    return db.query(Cliente).all()


def get_cliente_by_id(db: Session, cliente_id: int) -> Optional[Cliente]:
    return (
        db.query(Cliente)
        .filter(Cliente.id_cliente == cliente_id)
        .first()
    )


# ----------------------------------------------------------------------------------------------------------------------
# UPDATE
# ----------------------------------------------------------------------------------------------------------------------

def update_cliente(
    db: Session,
    cliente: Cliente,
    cliente_in: ClienteUpdate
) -> Cliente:

    if cliente_in.nombre is not None:
        cliente.nombre = cliente_in.nombre

    if cliente_in.apellido is not None:
        cliente.apellido = cliente_in.apellido

    if cliente_in.telefono is not None:
        cliente.telefono = cliente_in.telefono

    if cliente_in.email is not None:
        cliente.email = cliente_in.email

    db.commit()
    db.refresh(cliente)

    return cliente


# ----------------------------------------------------------------------------------------------------------------------
# DELETE
# ----------------------------------------------------------------------------------------------------------------------

def delete_cliente(db: Session, cliente: Cliente) -> None:
    db.delete(cliente)
    db.commit()
