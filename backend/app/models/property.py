from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from typing import Dict, Any, List
import uuid

from app.models.base import Base

class Property(Base):
    __tablename__ = "properties"

    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    overview: Mapped[str] = mapped_column(Text, nullable=True)
    checkin: Mapped[str] = mapped_column(String(50), nullable=True)
    checkout: Mapped[str] = mapped_column(String(50), nullable=True)
    iframe_src: Mapped[str] = mapped_column(Text, nullable=True)
    
    capacity: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=True)
    space_overview: Mapped[List[str]] = mapped_column(JSONB, nullable=True)
    amenities: Mapped[List[str]] = mapped_column(JSONB, nullable=True)
    rooms: Mapped[List[Dict[str, str]]] = mapped_column(JSONB, nullable=True)
    rules: Mapped[List[str]] = mapped_column(JSONB, nullable=True)

class Gallery(Base):
    __tablename__ = "galleries"
    
    # Overriding the default id from Base since property_slug is primary key in our schema
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_slug: Mapped[str] = mapped_column(String(255), ForeignKey("properties.slug", ondelete="CASCADE"), nullable=False, unique=True)
    images: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
