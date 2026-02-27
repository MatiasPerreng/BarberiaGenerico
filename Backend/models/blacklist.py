from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .base import Base

class Blacklist(Base):
    __tablename__ = "blacklist"
    
    id = Column(Integer, primary_key=True, index=True)
    telefono = Column(String(20), unique=True, index=True, nullable=False)
    motivo = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())