from typing import Optional, List
import decimal

from sqlalchemy import String, DECIMAL
from sqlalchemy.dialects.mysql import INTEGER, TINYINT
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import text

from .base import Base


class Servicio(Base):
    __tablename__ = 'servicio'

    id_servicio: Mapped[int] = mapped_column(INTEGER, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    duracion_min: Mapped[int] = mapped_column(INTEGER, nullable=False)
    precio: Mapped[decimal.Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    activo: Mapped[Optional[int]] = mapped_column(
        TINYINT(1),
        server_default=text("'1'")
    )
    imagen: Mapped[Optional[str]] = mapped_column(String(255))

    visita: Mapped[List["Visita"]] = relationship(
        "Visita",
        back_populates="servicio"
    )
