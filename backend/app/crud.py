# GET    /books          получить список книг
# GET    /books/{id}     получить одну книгу
# POST   /books          добавить книгу
# PATCH    /books/{id}     изменить книгу
# DELETE /books/{id}     удалить книгу

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.database import SessionDep
from app.models import Book, BookCreate, BookRead, BookUpdate


books_router = APIRouter(prefix="/books", tags=["Books"])


@books_router.get("/", response_model=list[BookRead])
async def get_books(session: SessionDep):
    result = await session.execute(select(Book))
    return result.scalars().all()


@books_router.post("/", response_model=BookRead)
async def create_book(book: BookCreate, session: SessionDep):
    db_book = Book.model_validate(book)

    session.add(db_book)
    await session.commit()
    await session.refresh(db_book)

    return db_book


@books_router.get("/{book_id}", response_model=BookRead)
async def get_book(book_id: int, session: SessionDep):
    result = await session.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()
    if not db_book:
        raise HTTPException(404, detail="Book not found")
    return db_book


@books_router.patch("/{book_id}", response_model=BookRead)
async def update_book(book_id: int, book: BookUpdate, session: SessionDep):
    result = await session.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()
    if not db_book:
        raise HTTPException(404, detail="Book not found")

    update_data = book.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)

    session.add(db_book)
    await session.commit()
    await session.refresh(db_book)

    return db_book


@books_router.delete("/{book_id}")
async def delete_book(book_id: int, session: SessionDep):
    result = await session.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()
    if not db_book:
        raise HTTPException(404, detail="Book not found")

    await session.delete(db_book)
    await session.commit()

    return {"detail": "Book deleted"}
