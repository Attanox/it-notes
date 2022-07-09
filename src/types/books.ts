export type Book = {
  title: string;
  subtitle: string | null;
  isbn13: string;
  price: string;
  image: string;
};

export type BookList = {
  error: number;
  total: number;
  page?: number;
  books: Book[];
};
