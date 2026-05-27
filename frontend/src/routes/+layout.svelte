<script lang="ts">
  import '../app.css';
  import { LibraryBig, Plus, Search } from '@lucide/svelte';
  import { navigating } from '$app/stores';
</script>

<svelte:head>
  <title>BookHaven</title>
  <meta
    name="description"
    content="BookHaven — учебная АИС книжного магазина для просмотра и управления книгами"
  />
</svelte:head>

{#if $navigating}
  <div class="fixed inset-x-0 top-0 z-50 h-1 bg-brass" aria-hidden="true"></div>
{/if}

<div class="min-h-screen">
  <header class="border-b border-[#dfd2c0] bg-vellum/85 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <a href="/" class="flex items-center gap-3">
        <span class="flex h-12 w-12 items-center justify-center rounded-md bg-moss text-white shadow-soft">
          <LibraryBig size={26} aria-hidden="true" />
        </span>
        <span>
          <span class="block font-serif text-3xl leading-none text-ink">BookHaven</span>
          <span class="mt-1 block text-sm text-[#725f50]">книжный рай для вашей библиотеки</span>
        </span>
      </a>

      <nav class="flex flex-wrap items-center gap-2">
        <a class="btn btn-secondary" href="/">
          <Search size={18} aria-hidden="true" />
          Каталог
        </a>
        <a class="btn btn-primary" href="/books/new">
          <Plus size={18} aria-hidden="true" />
          Добавить книгу
        </a>
      </nav>
    </div>
  </header>

  <main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>
