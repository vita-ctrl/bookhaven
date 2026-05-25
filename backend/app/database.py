from fastapi import Depends
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel

# Without this import, models will not be registered with SQLModel.metadata, and the tables won't be created in the database when init_db() is called.
from app.config import get_settings
from app.models import *  # noqa: F403

settings = get_settings()

DATABASE_URL = settings.DB.URL

async_engine = create_async_engine(url=DATABASE_URL, echo=False)

async_session = async_sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():

    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session():

    async with async_session() as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_session)]
