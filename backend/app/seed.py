from datetime import date

from sqlmodel import select

from app.database import async_session
from app.models import Book


books = [
    Book(
        title="1984",
        author="George Orwell",
        published_date=date(1949, 6, 8),
        isbn="978-0451524935",
    ),
    Book(
        title="The Hobbit",
        author="J.R.R. Tolkien",
        published_date=date(1937, 9, 21),
        isbn="978-0547928227",
    ),
    Book(
        title="To Kill a Mockingbird",
        author="Harper Lee",
        published_date=date(1960, 7, 11),
        isbn="978-0061120084",
    ),
    Book(
        title="Pride and Prejudice",
        author="Jane Austen",
        published_date=date(1813, 1, 28),
        isbn="978-1503290563",
    ),
    Book(
        title="The Great Gatsby",
        author="F. Scott Fitzgerald",
        published_date=date(1925, 4, 10),
        isbn="978-0743273565",
    ),
]


async def seed_books():
    async with async_session() as session:
        result = await session.execute(select(Book))
        existing_book = result.scalars().first()

        if existing_book:
            return

        session.add_all(books)

        await session.commit()
