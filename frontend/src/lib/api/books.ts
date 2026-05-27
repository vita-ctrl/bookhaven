import { env } from '$env/dynamic/public';
import type {
  Book,
  BookCreateInput,
  BookPage,
  BookUpdateInput,
  BookWithDownload
} from '$lib/types/book';

type Fetcher = typeof fetch;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const apiBaseUrl = () => (env.PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

async function request<T>(fetcher: Fetcher, path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  const response = await fetcher(`${apiBaseUrl()}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === 'string') return data.detail;
    if (data.detail) return JSON.stringify(data.detail);
  } catch {
    // Fall through to status text.
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Не удалось выполнить запрос к API';
};

export const getBookDownloadUrl = (id: number) => `${apiBaseUrl()}/books/${id}/download`;

export const getBooks = (fetcher: Fetcher = fetch) => request<Book[]>(fetcher, '/books/');

export interface BookPageParams {
  offset?: number;
  limit?: number;
  q?: string;
}

export const getBooksPage = (fetcher: Fetcher = fetch, params: BookPageParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.q) searchParams.set('q', params.q);

  const query = searchParams.toString();
  return request<BookPage>(fetcher, `/books/page/${query ? `?${query}` : ''}`);
};

export const getBook = (id: number, fetcher: Fetcher = fetch) =>
  request<BookWithDownload>(fetcher, `/books/${id}`);

export const createBook = (book: BookCreateInput, fetcher: Fetcher = fetch) =>
  request<Book>(fetcher, '/books/', {
    method: 'POST',
    body: JSON.stringify(book)
  });

export const updateBook = (id: number, book: BookUpdateInput, fetcher: Fetcher = fetch) =>
  request<Book>(fetcher, `/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(book)
  });

export const deleteBook = (id: number, fetcher: Fetcher = fetch) =>
  request<{ detail: string }>(fetcher, `/books/${id}`, {
    method: 'DELETE'
  });
