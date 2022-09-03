import type { Book, BookList } from "types/books";

export function fetchBooks(type = "", customConfig = {}): Promise<BookList> {
  const config = {
    method: "GET",
    ...customConfig,
  };

  const url = `${process.env.BOOKS_URL}${type}`;

  return fetch(url, config).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
}

export function fetchBook(isbn13 = "", customConfig = {}): Promise<Book> {
  const config = {
    method: "GET",
    ...customConfig,
  };

  const url = `${process.env.BOOKS_URL}books/${isbn13}`;

  return fetch(url, config).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
}
