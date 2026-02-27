import datetime
from typing import List

from sqlalchemy import (
    CheckConstraint,
    ForeignKeyConstraint,
    Index,
    Date,
    Time
)
from sqlalchemy.dialects.mysql import INTEGER, TINYINT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class HorarioBarbero(Base):
    __tablename__ = 'horario_barbero'
    __table_args__ = (
        CheckConstraint('(`hora_desde` < `hora_hasta`)', name='chk_hora_valida'),
        ForeignKeyConstraint(
            ['id_barbero'],
            ['barbero.id_barbero'],
            ondelete='CASCADE',
            name='fk_horario_barbero'
        ),
        Index('fk_horario_barbero', 'id_barbero')
    )

    id_horario: Mapped[int] = mapped_column(INTEGER, primary_key=True)
    id_barbero: Mapped[int] = mapped_column(INTEGER, nullable=False)
    dia_semana: Mapped[int] = mapped_column(TINYINT, nullable=False)
    hora_desde: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    hora_hasta: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    fecha_desde: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    fecha_hasta: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    barbero: Mapped["Barbero"] = relationship(
        "Barbero",
        back_populates="horario_barbero"
    )
