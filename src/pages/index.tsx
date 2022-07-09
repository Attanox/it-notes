import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";

import Spinner from "components/Spinner";
import Card from "components/Card";
import Pagination from "components/Pagination";
import Search from "components/Search";
import { trpc } from "utils/trpc";
import type { Book } from "types/books";

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
  const [bookData, setBookData] = React.useState<Book[]>([]);
  const [pages, setPages] = React.useState(1);

  const newestQuery = trpc.useQuery(["books.newest"], {
    onSuccess: (data) => setBookData(data),
  });
  const searchMutation = trpc.useMutation(["books.search"], {
    onSuccess: ({ books, pages }, variables) => {
      setBookData(books);
      // * we're counting total on each request which can change number of pages at last page
      // * so we're setting number of pages only after clicking search button
      if (variables?.page === undefined) {
        setPages(pages);
      }
    },
  });

  return (
    <>
      <Head>
        <title>IT Notes</title>
        <meta name="description" content="Notes taking app for IT books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-full">
        <div className="w-full h-full">
          <Search searchMutate={searchMutation.mutate} />
          <div className="w-full h-5" />
          {newestQuery.isLoading || searchMutation.isLoading ? (
            <div className="w-full min-h-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <BooksList books={bookData || []} />
          )}
          <Pagination
            numberOfPages={pages}
            onPageChange={(page) =>
              searchMutation.mutate({
                searchQuery: searchMutation.variables?.searchQuery || "",
                page,
              })
            }
          />
        </div>
      </div>
    </>
  );
};

export default Home;
