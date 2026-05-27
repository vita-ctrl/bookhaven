import type { BookCreateInput } from '$lib/types/book';

interface BookPayloadOptions {
  includeDownloadUrl?: boolean;
}

export interface BookFormValues {
  title: string;
  author: string;
  published_date: string;
  isbn: string;
  cover_url: string;
  download_url: string;
}

export type BookFieldErrors = Partial<Record<keyof BookFormValues, string>>;

const getString = (formData: FormData, key: keyof BookFormValues) =>
  String(formData.get(key) ?? '').trim();

export const getBookFormValues = (formData: FormData): BookFormValues => ({
  title: getString(formData, 'title'),
  author: getString(formData, 'author'),
  published_date: getString(formData, 'published_date'),
  isbn: getString(formData, 'isbn'),
  cover_url: getString(formData, 'cover_url'),
  download_url: getString(formData, 'download_url')
});

export const validateBookForm = (values: BookFormValues): BookFieldErrors => {
  const errors: BookFieldErrors = {};

  if (!values.title) errors.title = 'Введите название книги';
  if (!values.author) errors.author = 'Введите автора';
  if (!values.published_date) errors.published_date = 'Укажите дату публикации';
  if (values.published_date && !/^\d{4}-\d{2}-\d{2}$/.test(values.published_date)) {
    errors.published_date = 'Используйте формат YYYY-MM-DD';
  }
  if (!values.isbn) errors.isbn = 'Введите ISBN';
  if (values.cover_url.length > 500) errors.cover_url = 'Ссылка должна быть не длиннее 500 символов';

  return errors;
};

export const hasFieldErrors = (errors: BookFieldErrors) => Object.keys(errors).length > 0;

export const toBookPayload = (
  values: BookFormValues,
  options: BookPayloadOptions = {}
): BookCreateInput => {
  const payload: BookCreateInput = {
    title: values.title,
    author: values.author,
    published_date: values.published_date,
    isbn: values.isbn,
    cover_url: values.cover_url || null
  };

  if (options.includeDownloadUrl) {
    payload.download_url = values.download_url || null;
  }

  return payload;
};
