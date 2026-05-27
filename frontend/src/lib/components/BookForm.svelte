<script lang="ts">
  import { ArrowLeft, Image, Save } from '@lucide/svelte';
  import type { BookFieldErrors, BookFormValues } from '$lib/forms/book';

  export let values: Partial<BookFormValues> | undefined = {};
  export let fieldErrors: BookFieldErrors | undefined = {};
  export let error: string | undefined = undefined;
  export let submitLabel = 'Сохранить';
  export let cancelHref = '/';

  const today = new Date().toISOString().slice(0, 10);

  $: formValues = values ?? {};
  $: errors = fieldErrors ?? {};
</script>

<form method="POST" class="panel mx-auto max-w-3xl p-6 sm:p-8">
  {#if error}
    <div class="mb-6 rounded-md border border-oxblood/30 bg-oxblood/10 px-4 py-3 text-sm text-oxblood">
      {error}
    </div>
  {/if}

  <div class="grid gap-5 sm:grid-cols-2">
    <label class="block sm:col-span-2">
      <span class="label">Название</span>
      <input class="field" name="title" value={formValues.title ?? ''} autocomplete="off" required maxlength="255" />
      {#if errors.title}
        <span class="mt-2 block text-sm text-oxblood">{errors.title}</span>
      {/if}
    </label>

    <label class="block sm:col-span-2">
      <span class="label">Автор</span>
      <input class="field" name="author" value={formValues.author ?? ''} autocomplete="off" required maxlength="255" />
      {#if errors.author}
        <span class="mt-2 block text-sm text-oxblood">{errors.author}</span>
      {/if}
    </label>

    <label class="block">
      <span class="label">Дата публикации</span>
      <input class="field" type="date" name="published_date" value={formValues.published_date ?? today} required />
      {#if errors.published_date}
        <span class="mt-2 block text-sm text-oxblood">{errors.published_date}</span>
      {/if}
    </label>

    <label class="block">
      <span class="label">ISBN</span>
      <input class="field" name="isbn" value={formValues.isbn ?? ''} autocomplete="off" required maxlength="20" />
      {#if errors.isbn}
        <span class="mt-2 block text-sm text-oxblood">{errors.isbn}</span>
      {/if}
    </label>

    <label class="block sm:col-span-2">
      <span class="label flex items-center gap-2">
        <Image size={16} aria-hidden="true" />
        Ссылка на обложку
      </span>
      <input
        class="field"
        name="cover_url"
        value={formValues.cover_url ?? ''}
        autocomplete="off"
        maxlength="500"
        placeholder="Оставьте пустым для автоматической обложки BookHaven"
      />
      {#if errors.cover_url}
        <span class="mt-2 block text-sm text-oxblood">{errors.cover_url}</span>
      {/if}
    </label>
  </div>

  <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <a class="btn btn-secondary" href={cancelHref}>
      <ArrowLeft size={18} aria-hidden="true" />
      Назад
    </a>
    <button class="btn btn-primary">
      <Save size={18} aria-hidden="true" />
      {submitLabel}
    </button>
  </div>
</form>
