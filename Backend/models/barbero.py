from typing import Optional, List
import datetime

from sqlalchemy import String, TIMESTAMP, text, Boolean
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Barbero(Base):
    __tablename__ = "barbero"

    # -------------------------
    # CAMPOS BÁSICOS
    # -------------------------

    id_barbero: Mapped[int] = mapped_column(
        INTEGER,
        primary_key=True,
        autoincrement=True
    )

    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    activo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("1")
    )

    foto_url: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )

    # -------------------------
    # NUEVOS: CAMPOS DE DESCANSO
    # -------------------------
    # Guardamos como String (ej: "13:00") para facilitar 
    # la comparación con el input type="time" de React
    descanso_inicio: Mapped[Optional[str]] = mapped_column(
        String(10),
        nullable=True
    )

    descanso_fin: Mapped[Optional[str]] = mapped_column(
        String(10),
        nullable=True
    )

    # -------------------------
    # AUDITORÍA
    # -------------------------

    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    # -------------------------
    # RELACIÓN LOGIN (1–1)
    # -------------------------

    login: Mapped[Optional["LoginBarbero"]] = relationship(
        "LoginBarbero",
        back_populates="barbero",
        uselist=False,
        cascade="all, delete-orphan"  # Necesario para borrar barbero y su acceso
    )

    # -------------------------
    # RELACIONES DE AGENDA
    # -------------------------

    horario_barbero: Mapped[List["HorarioBarbero"]] = relationship(
        "HorarioBarbero",
        back_populates="barbero",
        cascade="all, delete-orphan"
    )

    horario_excepcion: Mapped[List["HorarioExcepcion"]] = relationship(
        "HorarioExcepcion",
        back_populates="barbero",
        cascade="all, delete-orphan"
    )

    visita: Mapped[List["Visita"]] = relationship(
        "Visita",
        back_populates="barbero"
        # Sin cascade para mantener el historial de visitas aunque se borre el barbero
    )