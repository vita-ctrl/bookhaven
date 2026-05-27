<script lang="ts">
  import BookForm from '$lib/components/BookForm.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: values = form?.values ?? {
    title: data.book.title,
    author: data.book.author,
    published_date: data.book.published_date,
    isbn: data.book.isbn,
    cover_url: data.book.cover_url ?? ''
  };
</script>

<section class="mb-8">
  <p class="text-sm font-semibold uppercase text-moss">редактирование</p>
  <h1 class="mt-2 font-serif text-4xl text-ink">{data.book.title}</h1>
  <p class="mt-3 max-w-2xl text-[#6c5d51]">
    Обновите данные книги и сохраните изменения в каталоге.
  </p>
</section>

<BookForm
  {values}
  fieldErrors={form?.fieldErrors}
  error={form?.error}
  submitLabel="Сохранить изменения"
  cancelHref={`/books/${data.book.id}`}
/>
