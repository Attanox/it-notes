import * as React from "react";
import { Book } from "types/books";
import Card from "./Card";

const BookList = (props: { books: Book[] }) => {
  const { books } = props;

  if (!books.length) {
    return <p className="text-center text-2xl">No books :(</p>;
  }

  return (
    <div
      style={{ gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )" }}
      className="grid gap-8"
    >
      {books.map((book) => (
        <Card key={book.isbn13} book={book} />
      ))}
    </div>
  );
};

export default BookList;
