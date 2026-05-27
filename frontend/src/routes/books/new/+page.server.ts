import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ApiError, createBook, getApiErrorMessage } from '$lib/api/books';
import {
  getBookFormValues,
  hasFieldErrors,
  toBookPayload,
  validateBookForm
} from '$lib/forms/book';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const values = getBookFormValues(await request.formData());
    const fieldErrors = validateBookForm(values);

    if (hasFieldErrors(fieldErrors)) {
      return fail(400, { values, fieldErrors });
    }

    let created;
    try {
      created = await createBook(toBookPayload(values, { includeDownloadUrl: true }), fetch);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      return fail(status, { values, error: getApiErrorMessage(error) });
    }

    throw redirect(303, `/books/${created.id}`);
  }
};
