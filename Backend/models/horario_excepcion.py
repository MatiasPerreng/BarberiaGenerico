import datetime
from typing import Optional

from sqlalchemy import Enum, ForeignKeyConstraint, Index, Date, Time
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class HorarioExcepcion(Base):
    __tablename__ = 'horario_excepcion'
    __table_args__ = (
        ForeignKeyConstraint(
            ['id_barbero'],
            ['barbero.id_barbero'],
            name='horario_excepcion_ibfk_1'
        ),
        Index('id_barbero', 'id_barbero')
    )

    id_excepcion: Mapped[int] = mapped_column(INTEGER, primary_key=True)
    id_barbero: Mapped[int] = mapped_column(INTEGER, nullable=False)
    fecha: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    tipo: Mapped[str] = mapped_column(
        Enum('cierre', 'horario_especial'),
        nullable=False
    )
    hora_desde: Mapped[Optional[datetime.time]] = mapped_column(Time)
    hora_hasta: Mapped[Optional[datetime.time]] = mapped_column(Time)

    barbero: Mapped["Barbero"] = relationship(
        "Barbero",
        back_populates="horario_excepcion"
    )
