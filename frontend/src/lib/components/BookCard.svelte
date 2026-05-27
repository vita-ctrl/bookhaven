<script lang="ts">
  import {
    CalendarDays,
    Eye,
    Hash,
    Pencil,
    Trash2,
    UserRound,
  } from "@lucide/svelte";
  import type { Book } from "$lib/types/book";
  import { formatDate } from "$lib/utils/format";

  export let book: Book;
  let coverFailed = false;

  $: if (book.id) coverFailed = false;

  const confirmDelete = (event: SubmitEvent) => {
    if (!confirm(`Удалить книгу «${book.title}»?`)) {
      event.preventDefault();
    }
  };
</script>

<article class="panel group flex min-h-[24rem] flex-col overflow-hidden">
  <a href={`/books/${book.id}`} class="block">
    <div class="relative h-56 overflow-hidden bg-[#ead8bf]">
      {#if book.cover_url && !coverFailed}
        <img
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          src={book.cover_url}
          alt={`Обложка книги ${book.title}`}
          loading="lazy"
          onerror={() => (coverFailed = true)}
        />
      {:else}
        <div
          class="h-full w-full bg-[linear-gradient(90deg,#435f46_0_18%,#7a2e2e_18%_34%,#c98a2c_34%_47%,#6b3f28_47%_62%,#f3f7f1_62%_74%,#435f46_74%_100%)]"
        ></div>
      {/if}
      <div
        class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent"
      ></div>
    </div>
  </a>

  <div class="flex flex-1 flex-col p-5">
    <div class="min-h-[5.25rem]">
      <h2 class="font-serif text-2xl leading-tight text-ink">
        <a class="transition hover:text-oxblood" href={`/books/${book.id}`}
          >{book.title}</a
        >
      </h2>
      <p class="mt-2 flex items-center gap-2 text-sm text-[#6c5d51]">
        <UserRound size={16} aria-hidden="true" />
        {book.author}
      </p>
    </div>

    <dl class="mt-5 space-y-3 text-sm text-[#5f5148]">
      <div class="flex items-center gap-2">
        <CalendarDays size={16} class="text-moss" aria-hidden="true" />
        <dt class="sr-only">Дата публикации</dt>
        <dd>{formatDate(book.published_date)}</dd>
      </div>
      <div class="flex items-center gap-2">
        <Hash size={16} class="text-moss" aria-hidden="true" />
        <dt class="sr-only">ISBN</dt>
        <dd class="break-all">{book.isbn}</dd>
      </div>
    </dl>

    <div class="mt-auto flex items-center gap-2 pt-6">
      <a
        class="icon-btn"
        href={`/books/${book.id}`}
        title="Подробнее"
        aria-label={`Подробнее: ${book.title}`}
      >
        <Eye size={18} aria-hidden="true" />
      </a>
      <a
        class="icon-btn"
        href={`/books/${book.id}/edit`}
        title="Редактировать"
        aria-label={`Редактировать: ${book.title}`}
      >
        <Pencil size={18} aria-hidden="true" />
      </a>
      <form
        method="POST"
        action="?/delete"
        class="ml-auto"
        onsubmit={confirmDelete}
      >
        <input type="hidden" name="id" value={book.id} />
        <button
          class="icon-btn text-oxblood hover:border-oxblood"
          title="Удалить"
          aria-label={`Удалить: ${book.title}`}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  </div>
</article>
