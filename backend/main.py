from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.crud import books_router
from app.database import init_db
from app.seed import seed_books


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    await seed_books()
    yield


app = FastAPI(
    lifespan=lifespan,
    title="BookHaven API",
    description="API for bookstore",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(books_router)


@app.get("/")
async def root():
    return {"message": "BookHaven API works!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
