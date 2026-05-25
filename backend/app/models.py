from datetime import date
from sqlmodel import Field, SQLModel


class BookBase(SQLModel):
    title: str = Field(max_length=255)
    author: str = Field(max_length=255)
    published_date: date = Field(default_factory=date.today)
    isbn: str = Field(max_length=20)


class Book(BookBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    isbn: str = Field(max_length=20, unique=True)


class BookCreate(BookBase):
    pass


class BookUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    author: str | None = Field(default=None, max_length=255)
    published_date: date | None = Field(default=None)
    isbn: str | None = Field(default=None, max_length=20)


class BookRead(BookBase):
    id: int
