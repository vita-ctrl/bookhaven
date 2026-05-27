<script lang="ts">
  import {
    ArrowLeft,
    CalendarDays,
    Hash,
    Pencil,
    Trash2,
    UserRound,
  } from "@lucide/svelte";
  import { formatDate } from "$lib/utils/format";
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;
  let coverFailed = false;

  $: if (data.book.id) coverFailed = false;

  const confirmDelete = (event: SubmitEvent) => {
    if (!confirm(`Удалить книгу «${data.book.title}»?`)) {
      event.preventDefault();
    }
  };
</script>

<section class="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
  <aside class="panel p-5">
    <div
      class="relative mx-auto aspect-[2/3] max-w-[19rem] overflow-hidden rounded-md bg-[#ead8bf] shadow-soft"
    >
      {#if data.book.cover_url && !coverFailed}
        <img
          class="h-full w-full object-cover"
          src={data.book.cover_url}
          alt={`Обложка книги ${data.book.title}`}
          onerror={() => (coverFailed = true)}
        />
      {:else}
        <div
          class="h-full w-full bg-[linear-gradient(90deg,#435f46_0_18%,#7a2e2e_18%_34%,#c98a2c_34%_47%,#6b3f28_47%_62%,#f3f7f1_62%_74%,#435f46_74%_100%)]"
        ></div>
      {/if}
      <div
        class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent"
      ></div>
    </div>
  </aside>

  <article class="panel p-6 sm:p-8">
    <a class="btn btn-secondary mb-8" href="/">
      <ArrowLeft size={18} aria-hidden="true" />
      В каталог
    </a>

    <p class="text-sm font-semibold uppercase text-moss">подробности книги</p>
    <h1 class="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
      {data.book.title}
    </h1>

    <dl class="mt-8 grid gap-4 sm:grid-cols-2">
      <div class="rounded-md border border-[#dfd2c0] bg-white/70 p-4">
        <dt class="flex items-center gap-2 text-sm font-semibold text-moss">
          <UserRound size={17} aria-hidden="true" />
          Автор
        </dt>
        <dd class="mt-2 text-lg text-ink">{data.book.author}</dd>
      </div>
      <div class="rounded-md border border-[#dfd2c0] bg-white/70 p-4">
        <dt class="flex items-center gap-2 text-sm font-semibold text-moss">
          <CalendarDays size={17} aria-hidden="true" />
          Дата публикации
        </dt>
        <dd class="mt-2 text-lg text-ink">
          {formatDate(data.book.published_date)}
        </dd>
      </div>
      <div
        class="rounded-md border border-[#dfd2c0] bg-white/70 p-4 sm:col-span-2"
      >
        <dt class="flex items-center gap-2 text-sm font-semibold text-moss">
          <Hash size={17} aria-hidden="true" />
          ISBN
        </dt>
        <dd class="mt-2 break-all text-lg text-ink">{data.book.isbn}</dd>
      </div>
    </dl>

    {#if form?.error}
      <div
        class="mt-6 rounded-md border border-oxblood/30 bg-oxblood/10 px-4 py-3 text-sm text-oxblood"
      >
        {form.error}
      </div>
    {/if}

    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <a class="btn btn-primary" href={`/books/${data.book.id}/edit`}>
        <Pencil size={18} aria-hidden="true" />
        Редактировать
      </a>
      <form method="POST" action="?/delete" onsubmit={confirmDelete}>
        <button class="btn btn-danger w-full sm:w-auto">
          <Trash2 size={18} aria-hidden="true" />
          Удалить
        </button>
      </form>
    </div>
  </article>
</section>
