import React from "react";
import { AiFillDelete, AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import { fetchBook } from "utils/fetch";
import Card from "components/Card";
import Link from "next/link";
import type { Book } from "types/books";
import GoBack from "components/GoBack";
import Spinner from "components/Spinner";

type LocalProps = {
  book: Book | null;
};

export const getServerSideProps: GetServerSideProps<LocalProps> = async (
  ctx
) => {
  const book = ctx.params
    ? await fetchBook(ctx?.params?.isbn13 as string)
    : null;

  return {
    props: {
      book,
    },
  };
};

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
                  <AiOutlinePlusCircle />
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
                    <a className="btn btn-circle text-xl">
                      <AiFillEdit className="fill-green-400" />
                    </a>
                  </Link>
                  <div className="w-2" />
                  <button
                    onClick={() => onRemoveChapter(chapter.id)}
                    className="btn btn-circle text-xl"
                  >
                    <AiFillDelete className="fill-rose-400" />
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
