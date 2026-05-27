import { error as kitError, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ApiError, deleteBook, getApiErrorMessage, getBook } from '$lib/api/books';

const parseId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw kitError(400, 'Некорректный ID книги');
  }
  return id;
};

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    return {
      book: await getBook(parseId(params.id), fetch)
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw kitError(404, 'Книга не найдена');
    }
    throw kitError(500, getApiErrorMessage(error));
  }
};

export const actions: Actions = {
  delete: async ({ params, fetch }) => {
    try {
      await deleteBook(parseId(params.id), fetch);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      return fail(status, { error: getApiErrorMessage(error) });
    }

    throw redirect(303, '/');
  }
};
