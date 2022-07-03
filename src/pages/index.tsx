import type { NextPage } from "next";
import Head from "next/head";

import { trpc } from "../utils/trpc";
import type { Book } from "../types/books";

const BooksList = (props: { books: Book[] }) => {
  const { books } = props;

  return (
    <div className="flex-col">
      {books.map((book) => (
        <div key={book.isbn13} className="flex-col">
          <h4 className="text-2xl">{book.title}</h4>
          <h5 className="text-xl">{book.subtitle}</h5>
          <div className="w-full h-5" />
        </div>
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
      <div className="flex flex-col items-center justify-center w-1/2 min-h-screen mx-auto">
        <div className="w-fit">
          <h3 className="mt-4 text-3xl">Newest IT books:</h3>

          <div className="py-6 text-2xl">
            {isLoading ? <p>Loading..</p> : <BooksList books={data || []} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
