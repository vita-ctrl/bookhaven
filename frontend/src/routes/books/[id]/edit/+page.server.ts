import { error as kitError, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ApiError, getApiErrorMessage, getBook, updateBook } from '$lib/api/books';
import {
  getBookFormValues,
  hasFieldErrors,
  toBookPayload,
  validateBookForm
} from '$lib/forms/book';

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
  default: async ({ params, request, fetch }) => {
    const id = parseId(params.id);
    const values = getBookFormValues(await request.formData());
    const fieldErrors = validateBookForm(values);

    if (hasFieldErrors(fieldErrors)) {
      return fail(400, { values, fieldErrors });
    }

    let updated;
    try {
      updated = await updateBook(id, toBookPayload(values), fetch);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      return fail(status, { values, error: getApiErrorMessage(error) });
    }

    throw redirect(303, `/books/${updated.id}`);
  }
};
