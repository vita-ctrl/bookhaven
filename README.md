# BookHaven

BookHaven - это веб-приложение для ведения каталога книг. В нем можно смотреть список книг, искать по каталогу, открывать подробную страницу книги, добавлять новые записи, редактировать данные, удалять книги и скачивать файл книги, если для нее указана ссылка на скачивание.

Проект разделен на backend API и frontend-приложение.

## Возможности

- Каталог книг с пагинацией и поиском.
- Просмотр подробной информации о книге.
- Добавление, редактирование и удаление книг.
- Поддержка ссылок на обложки.
- Поддержка ссылки на файл книги.
- Кнопка скачивания появляется только у книг, для которых доступен файл.
- Автоматическое создание SQLite-базы и наполнение стартовыми книгами при запуске backend.

## Стек

### Backend

- Python
- FastAPI
- SQLModel
- SQLAlchemy
- SQLite через `aiosqlite`
- Pydantic Settings
- Uvicorn

### Frontend

- SvelteKit
- Svelte 5
- TypeScript
- Vite
- Tailwind CSS
- Lucide Svelte

## Структура проекта

```text
bookstore/
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── seed.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   └── routes/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Запуск проекта

Нужно запустить две части проекта: backend и frontend. Для удобства откройте два терминала.

### 1. Backend

Перейдите в папку backend:

```bash
cd backend
```

Создайте и активируйте виртуальное окружение:

```bash
python -m venv .venv
source .venv/bin/activate
```

Для Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Создайте файл окружения:

```bash
cp .env.example .env
```

В `.env` по умолчанию используется SQLite:

```env
DB__URL=sqlite+aiosqlite:///./bookstore.db
```

Запустите API:

```bash
python main.py
```

Backend будет доступен по адресу:

```text
http://localhost:8000
```

Документация API:

```text
http://localhost:8000/docs
```

При первом запуске backend создаст файл базы данных `backend/bookstore.db` и заполнит каталог стартовыми книгами.

### 2. Frontend

Во втором терминале перейдите в папку frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Создайте файл окружения:

```bash
cp .env.example .env
```

В `.env` должен быть указан адрес backend:

```env
PUBLIC_API_URL=http://localhost:8000
```

Запустите frontend:

```bash
npm run dev
```

Frontend будет доступен по адресу, который покажет Vite в терминале. Обычно это:

```text
http://localhost:5173
```

## Полезные команды

### Backend

Запуск API:

```bash
python main.py
```

### Frontend

Запуск dev-сервера:

```bash
npm run dev
```

Проверка Svelte и TypeScript:

```bash
npm run check
```

Сборка frontend:

```bash
npm run build
```

Предпросмотр production-сборки:

```bash
npm run preview
```

## Основные API-эндпоинты

```text
GET    /books/                 Получить список книг
GET    /books/page/            Получить страницу каталога с пагинацией и поиском
GET    /books/{book_id}        Получить одну книгу
GET    /books/{book_id}/download
                               Скачать книгу, если указана ссылка на файл
POST   /books/                 Добавить книгу
PATCH  /books/{book_id}        Обновить книгу
DELETE /books/{book_id}        Удалить книгу
```

## Как работает скачивание книг

У книги может быть поле `download_url`. Если оно заполнено, backend возвращает для книги `downloadable: true`, а frontend показывает кнопку скачивания.

Кнопка ведет на endpoint:

```text
/books/{book_id}/download
```

Backend проверяет наличие книги и ссылки, после чего перенаправляет пользователя на файл книги.

## Переменные окружения

### Backend

```env
DB__URL=sqlite+aiosqlite:///./bookstore.db
```

### Frontend

```env
PUBLIC_API_URL=http://localhost:8000
```
