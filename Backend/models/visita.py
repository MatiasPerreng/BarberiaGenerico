from typing import Optional
import datetime

from sqlalchemy import DateTime, Enum, ForeignKeyConstraint, Index, TIMESTAMP, text, Boolean
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Visita(Base):
    __tablename__ = 'visita'
    __table_args__ = (
        ForeignKeyConstraint(['id_barbero'], ['barbero.id_barbero'], name='fk_visita_barbero'),
        ForeignKeyConstraint(['id_cliente'], ['cliente.id_cliente'], name='fk_visita_cliente'),
        ForeignKeyConstraint(['id_servicio'], ['servicio.id_servicio'], name='fk_visita_servicio'),
        Index('fk_visita_barbero', 'id_barbero'),
        Index('fk_visita_cliente', 'id_cliente'),
        Index('fk_visita_servicio', 'id_servicio'),
    )

    id_visita: Mapped[int] = mapped_column(INTEGER, primary_key=True)
    fecha_hora: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    id_cliente: Mapped[int] = mapped_column(INTEGER, nullable=False)
    id_barbero: Mapped[int] = mapped_column(INTEGER, nullable=False)
    id_servicio: Mapped[int] = mapped_column(INTEGER, nullable=False)
    
    # Campo para controlar el envío de WhatsApp
    notificado_wsp: Mapped[bool] = mapped_column(
        Boolean, 
        nullable=False, 
        server_default=text("0")  # En MySQL/MariaDB 0 es False
    )

    estado: Mapped[Optional[str]] = mapped_column(
        Enum('CONFIRMADO', 'CANCELADO', 'COMPLETADO'),
        server_default=text("'CONFIRMADO'")
    )
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        TIMESTAMP,
        server_default=text('CURRENT_TIMESTAMP')
    )

    # Relaciones
    barbero: Mapped["Barbero"] = relationship("Barbero", back_populates="visita")
    cliente: Mapped["Cliente"] = relationship("Cliente", back_populates="visita")
    servicio: Mapped["Servicio"] = relationship("Servicio", back_populates="visita")