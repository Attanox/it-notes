import React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import { fetchBook } from "utils/fetch";
import Card from "components/Card";
import Link from "next/link";
import type { Book } from "types/books";
import GoBack from "components/GoBack";
import Spinner from "components/Spinner";
import { withAuth } from "utils/withAuth";

type LocalProps = {
  book: Book | null;
};

export const getServerSideProps: GetServerSideProps<LocalProps> = withAuth(
  async (ctx) => {
    const book = ctx.params
      ? await fetchBook(ctx?.params?.isbn13 as string)
      : null;

    return {
      props: {
        book,
      },
    };
  }
);

const BookDetail = ({
  book,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const listChaptersQuery = trpc.useQuery(
    ["books.list-chapters", { bookId: book?.isbn13 || "" }],
    { enabled: !!book }
  );
  const removeChapterMutation = trpc.useMutation(["books.remove-chapter"], {
    onSuccess: () => listChaptersQuery.refetch(),
  });
  const haveBook = trpc.useQuery(
    ["books.have-book", { isbn13: String(book?.isbn13) }],
    { enabled: !!book }
  );
  const addBook = trpc.useMutation(["books.add-book"], {
    onSuccess: () => haveBook.refetch(),
  });

  const onRemoveChapter = (chapterID: string) => {
    if (!chapterID) return;
    removeChapterMutation.mutate({ chapterID });
  };

  if (!book) {
    return null;
  }

  return (
    <div className="w-full flex flex-col md:flex-row mt-2">
      <div className="w-80 md:w-96 mx-auto">
        <Card book={book} action={false} />
      </div>
      <div className="h-full w-4" />
      {haveBook.isLoading ? (
        <div className="w-full min-h-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col w-full mt-8">
          <div className="flex flex-row">
            <GoBack />
            {haveBook.data ? (
              <Link href={`/books/${book.isbn13}/chapter/add`}>
                <a className="btn btn-sm btn-success gap-2 ml-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Add chapter
                </a>
              </Link>
            ) : (
              <button
                disabled={addBook.isLoading}
                onClick={() => addBook.mutate({ ...book })}
                className="btn btn-sm btn-success gap-2 ml-auto"
              >
                Add book
              </button>
            )}
          </div>
          <div className="divider" />
          <div className="grid gap-4 grid-cols-1 pb-4">
            {listChaptersQuery.data?.map((chapter) => {
              const lastUpdated = new Date(chapter.updatedAt);
              const formattedDate = `${lastUpdated.getDay()}-${lastUpdated.getMonth()}-${lastUpdated.getFullYear()}`;
              return (
                <div
                  key={chapter.id}
                  className="card card-compact flex flex-row items-center bg-base-200 px-4 py-3"
                >
                  <div className="flex flex-col h-full w-full">
                    <h4 className="card-title text-xl">{chapter.title}</h4>
                    <div className="divider my-0 w-11/12 mt-auto" />
                    <h3 className="text-md font-normal text-xs">
                      Last update: <b>{formattedDate}</b>
                    </h3>
                  </div>

                  <Link href={`/books/${book.isbn13}/chapter/${chapter.id}`}>
                    <a className="btn btn-circle text-xl text-green-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </a>
                  </Link>
                  <div className="w-2" />
                  <button
                    onClick={() => onRemoveChapter(chapter.id)}
                    className="btn btn-circle text-xl text-rose-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
            {!listChaptersQuery.data && (
              <p className="text-center text-error text-xl">
                No chapters found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
