export type Book = {
  title: string;
  subtitle: string;
  isbn13: string;
  price: string;
  image: string;
  url: string;
};

export type BookList = {
  error: number;
  total: number;
  page?: number;
  books: Book[];
};
