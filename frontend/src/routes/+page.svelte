<script lang="ts">
  import { AlertTriangle, BookOpen, Loader2, Search, Sparkles } from '@lucide/svelte';
  import BookCard from '$lib/components/BookCard.svelte';
  import { getApiErrorMessage, getBooksPage } from '$lib/api/books';
  import type { Book } from '$lib/types/book';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let search = '';
  let activeSearch = '';
  let books: Book[] = data.page.items;
  let total = data.page.total;
  let pageSize = data.page.limit;
  let pageError: string | null = null;
  let isLoadingMore = false;
  let isSearching = false;
  let lastPage = data.page;
  let searchTimer: ReturnType<typeof setTimeout> | undefined;

  $: if (data.page !== lastPage) {
    books = data.page.items;
    total = data.page.total;
    pageSize = data.page.limit;
    search = '';
    activeSearch = '';
    lastPage = data.page;
  }

  $: hasMore = books.length < total;
  $: visibleCount = books.length;
  $: currentError = form?.error ?? data.error ?? pageError;

  const loadPage = async (reset = false) => {
    const query = search.trim();

    if (reset) {
      isSearching = true;
    } else {
      isLoadingMore = true;
    }

    pageError = null;

    try {
      const page = await getBooksPage(fetch, {
        offset: reset ? 0 : books.length,
        limit: pageSize,
        q: query
      });

      books = reset ? page.items : [...books, ...page.items];
      total = page.total;
      activeSearch = query;
    } catch (error) {
      pageError = getApiErrorMessage(error);
    } finally {
      isSearching = false;
      isLoadingMore = false;
    }
  };

  const handleSearchInput = (event: Event) => {
    search = (event.currentTarget as HTMLInputElement).value;

    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      void loadPage(true);
    }, 350);
  };
</script>

<section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
  <div class="rounded-lg border border-[#dfd2c0] bg-vellum/90 p-6 shadow-soft sm:p-8">
    <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="mb-2 flex items-center gap-2 text-sm font-semibold uppercase text-moss">
          <Sparkles size={16} aria-hidden="true" />
          каталог BookHaven
        </p>
        <h1 class="font-serif text-4xl leading-tight text-ink sm:text-5xl">Книги на полках</h1>
        <p class="mt-3 max-w-2xl text-[#6c5d51]">
          Просматривайте библиотеку, открывайте карточки книг и поддерживайте каталог в порядке.
        </p>
      </div>
      <a class="btn btn-primary shrink-0" href="/books/new">
        <BookOpen size={18} aria-hidden="true" />
        Новая книга
      </a>
    </div>

    <div class="mt-7 max-w-2xl">
      <label class="label" for="book-search">Поиск</label>
      <div class="relative">
        <Search class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7c6d]" size={18} />
        <input
          id="book-search"
          class="field pl-11"
          value={search}
          oninput={handleSearchInput}
          placeholder="Название или автор"
          autocomplete="off"
        />
      </div>
    </div>
  </div>

  <aside class="panel p-6">
    <p class="text-sm font-semibold uppercase text-moss">Всего книг</p>
    <p class="mt-2 font-serif text-5xl text-ink">{total}</p>
    <div class="mt-5 h-2 rounded-full bg-[#e6d7c5]">
      <div class="h-2 rounded-full bg-brass" style={`width: ${total ? Math.round((visibleCount / total) * 100) : 0}%`}></div>
    </div>
    <p class="mt-4 text-sm text-[#6c5d51]">
      Показано: {visibleCount} из {total}
    </p>
    {#if activeSearch}
      <p class="mt-2 text-sm text-[#6c5d51]">Поиск: “{activeSearch}”</p>
    {/if}
  </aside>
</section>

{#if currentError}
  <div class="mt-6 flex items-start gap-3 rounded-md border border-oxblood/30 bg-oxblood/10 px-4 py-3 text-oxblood">
    <AlertTriangle class="mt-0.5 shrink-0" size={18} aria-hidden="true" />
    <p class="text-sm">{currentError}</p>
  </div>
{/if}

{#if !data.error}
  {#if isSearching}
    <div class="mt-8 flex items-center justify-center gap-2 rounded-lg border border-[#dfd2c0] bg-vellum/70 p-8 text-moss">
      <Loader2 class="animate-spin" size={20} aria-hidden="true" />
      <span class="text-sm font-semibold">Загружаем книги</span>
    </div>
  {/if}

  {#if books.length > 0}
    <section class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {#each books as book (book.id)}
        <BookCard {book} />
      {/each}
    </section>

    {#if hasMore}
      <div class="mt-8 flex justify-center">
        <button class="btn btn-secondary min-w-48" disabled={isLoadingMore || isSearching} onclick={() => loadPage(false)}>
          {#if isLoadingMore}
            <Loader2 class="animate-spin" size={18} aria-hidden="true" />
            Загружаем
          {:else}
            Загрузить ещё
          {/if}
        </button>
      </div>
    {/if}
  {:else}
    <section class="mt-8 rounded-lg border border-dashed border-[#cdbba7] bg-vellum/70 p-10 text-center">
      <BookOpen class="mx-auto text-moss" size={38} aria-hidden="true" />
      <h2 class="mt-4 font-serif text-3xl text-ink">Книги не найдены</h2>
      <p class="mx-auto mt-2 max-w-md text-[#6c5d51]">
        Измените поисковый запрос или добавьте первую книгу в каталог.
      </p>
      <a class="btn btn-primary mt-6" href="/books/new">Добавить книгу</a>
    </section>
  {/if}
{/if}
