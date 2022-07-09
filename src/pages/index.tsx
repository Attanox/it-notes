import type { NextPage } from "next";
import Head from "next/head";

import { trpc } from "../utils/trpc";
import Spinner from "components/Spinner";
import Card from "components/Card";
import type { Book } from "../types/books";

const BooksList = (props: { books: Book[] }) => {
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

const Home: NextPage = () => {
  const { data, isLoading, error } = trpc.useQuery(["books.newest"]);

  return (
    <>
      <Head>
        <title>IT Notes</title>
        <meta name="description" content="Notes taking app for IT books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-full">
        <div className="w-full h-full">
          <h3 className="mt-4 text-3xl">Newest IT books</h3>
          <div className="w-full h-5" />

          {isLoading ? (
            <div className="w-full min-h-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <BooksList books={data || []} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
