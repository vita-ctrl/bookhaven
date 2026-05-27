<script lang="ts">
  import BookForm from '$lib/components/BookForm.svelte';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<section class="mb-8">
  <p class="text-sm font-semibold uppercase text-moss">новая запись</p>
  <h1 class="mt-2 font-serif text-4xl text-ink">Добавить книгу</h1>
  <p class="mt-3 max-w-2xl text-[#6c5d51]">
    Заполните основные библиографические данные, чтобы книга появилась в каталоге.
  </p>
</section>

<BookForm
  values={form?.values}
  fieldErrors={form?.fieldErrors}
  error={form?.error}
  submitLabel="Добавить книгу"
  cancelHref="/"
/>
