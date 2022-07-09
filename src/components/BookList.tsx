import * as React from "react";
import { Book } from "types/books";
import Card from "./Card";

const BookList = (props: { books: Book[] }) => {
  const { books } = props;

  if (!books.length) {
    return <p className="text-center text-2xl">No books :(</p>;
  }

  return (
    <div className="grid gap-8 grid-cols-3">
      {books.map((book) => (
        <Card key={book.isbn13} book={book} />
      ))}
    </div>
  );
};

export default BookList;
