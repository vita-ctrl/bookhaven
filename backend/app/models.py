from datetime import date
from sqlmodel import Field, SQLModel


class BookBase(SQLModel):
    title: str = Field(max_length=255)
    author: str = Field(max_length=255)
    published_date: date = Field(default_factory=date.today)
    isbn: str = Field(max_length=20)
    cover_url: str | None = Field(default=None, max_length=500)


class Book(BookBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    isbn: str = Field(max_length=20, unique=True)
    download_url: str | None = Field(default=None)


class BookCreate(BookBase):
    download_url: str | None = Field(default=None)


class BookUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    author: str | None = Field(default=None, max_length=255)
    published_date: date | None = Field(default=None)
    isbn: str | None = Field(default=None, max_length=20)
    cover_url: str | None = Field(default=None, max_length=500)
    download_url: str | None = Field(default=None)


class BookRead(BookBase):
    id: int


class BookReadWithDownload(BookRead):
    downloadable: bool


class BookReadDetail(BookReadWithDownload):
    download_url: str | None = Field(default=None)


class BookPage(SQLModel):
    items: list[BookReadWithDownload]
    total: int
    offset: int
    limit: int
