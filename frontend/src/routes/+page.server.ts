import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ApiError, deleteBook, getApiErrorMessage, getBooksPage } from '$lib/api/books';

const PAGE_SIZE = 18;

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    return {
      page: await getBooksPage(fetch, { limit: PAGE_SIZE }),
      error: null
    };
  } catch (error) {
    return {
      page: {
        items: [],
        total: 0,
        offset: 0,
        limit: PAGE_SIZE
      },
      error: getApiErrorMessage(error)
    };
  }
};

export const actions: Actions = {
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id)) {
      return fail(400, { error: 'Некорректный ID книги' });
    }

    try {
      await deleteBook(id, fetch);
      return { deleted: true };
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      return fail(status, { error: getApiErrorMessage(error) });
    }
  }
};
