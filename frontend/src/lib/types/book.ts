export interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
  isbn: string;
  cover_url: string | null;
}

export interface BookPage {
  items: Book[];
  total: number;
  offset: number;
  limit: number;
}

export type BookCreateInput = Omit<Book, 'id'>;
export type BookUpdateInput = Partial<BookCreateInput>;
