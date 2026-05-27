# GET    /books          получить список книг
# GET    /books/{id}     получить одну книгу
# POST   /books          добавить книгу
# PATCH    /books/{id}     изменить книгу
# DELETE /books/{id}     удалить книгу

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy import func, or_
from sqlmodel import select

from app.database import SessionDep
from app.models import (
    Book,
    BookCreate,
    BookPage,
    BookRead,
    BookReadWithDownload,
    BookUpdate,
)


books_router = APIRouter(prefix="/books", tags=["Books"])


@books_router.get("/", response_model=list[BookRead])
async def get_books(session: SessionDep):
    result = await session.execute(select(Book))
    return result.scalars().all()


@books_router.get("/page/", response_model=BookPage)
async def get_books_page(
    session: SessionDep,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=18, ge=1, le=60),
    q: str | None = Query(default=None, max_length=255),
):
    query = select(Book)
    count_query = select(func.count()).select_from(Book)
    search = q.strip() if q else ""

    if search:
        pattern = f"%{search}%"
        condition = or_(Book.title.ilike(pattern), Book.author.ilike(pattern))
        query = query.where(condition)
        count_query = count_query.where(condition)

    total_result = await session.execute(count_query)
    books_result = await session.execute(
        query.order_by(Book.id).offset(offset).limit(limit)
    )

    return BookPage(
        items=[
            BookReadWithDownload(
                id=book.id,
                title=book.title,
                author=book.author,
                published_date=book.published_date,
                isbn=book.isbn,
                cover_url=book.cover_url,
                downloadable=bool(book.download_url),
            )
            for book in books_result.scalars().all()
        ],
        total=total_result.scalar_one(),
        offset=offset,
        limit=limit,
    )


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
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Book not found")
    return db_book


@books_router.get("/{book_id}/download")
async def download_book(book_id: int, session: SessionDep):
    result = await session.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()
    if not db_book:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Book not found")
    if not db_book.download_url:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Download URL not found")
    return RedirectResponse(url=db_book.download_url, status_code=status.HTTP_302_FOUND)


@books_router.patch("/{book_id}", response_model=BookRead)
async def update_book(book_id: int, book: BookUpdate, session: SessionDep):
    result = await session.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()
    if not db_book:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Book not found")

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
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Book not found")

    await session.delete(db_book)
    await session.commit()

    return {"detail": "Book deleted"}
