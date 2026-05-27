export interface BookBase {
  title: string;
  author: string;
  published_date: string;
  isbn: string;
  cover_url: string | null;
}

export interface Book extends BookBase {
  id: number;
  downloadable?: boolean;
}

export interface BookWithDownload extends Book {
  downloadable: boolean;
  download_url?: string | null;
}

export interface BookPayload extends BookBase {
  download_url?: string | null;
}

export interface BookPage {
  items: BookWithDownload[];
  total: number;
  offset: number;
  limit: number;
}

export type BookCreateInput = BookPayload;
export type BookUpdateInput = Partial<BookPayload>;
