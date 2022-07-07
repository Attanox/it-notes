import React from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import { verifyJwt } from "utils/jwt";
import { fetchBook } from "utils/fetch";
import type { Book } from "types/books";
import Card from "components/Card";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const book = ctx.params
    ? await fetchBook(ctx?.params?.isbn13 as string)
    : null;

  const token = ctx.req.cookies["token"] || "";

  console.log({ book });

  const authSession = verifyJwt<{ name: string }>(token);

  if (!authSession) {
    return {
      props: {
        authenticated: false,
        book: null,
      },
    };
  }

  return {
    props: {
      book,
      authenticated: true,
      user: authSession.name,
    },
  };
};

const BookDetail = ({
  book,
  authenticated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const addBookMutation = trpc.useMutation(["books.add-book"]);
  const removeChapterMutation = trpc.useMutation(["books.remove-chapter"]);

  const listChaptersQuery = trpc.useQuery(
    ["books.list-chapters", { bookId: book?.isbn13 || "" }],
    { enabled: !!book }
  );

  const onAddBook = () => {
    if (!book) return;
    addBookMutation.mutate({
      title: book.title,
      subtitle: book.subtitle,
      isbn13: book.isbn13,
      image: book.image,
      price: book.price,
    });
  };

  const onRemoveChapter = (chapterID: string) => {
    if (!chapterID) return;
    removeChapterMutation.mutate({ chapterID });
    listChaptersQuery.refetch();
  };

  if (!authenticated) {
    return <div>cant be here</div>;
  }

  if (!book) {
    return (
      <button
        onClick={onAddBook}
        disabled={addBookMutation.isLoading}
        className="btn btn-success"
      >
        add book
      </button>
    );
  }

  return (
    <div className="flex flex-row">
      <div className="w-96">
        <Card book={book} action={false} />
      </div>
      <div className="h-full w-4" />
      <div className="flex flex-col w-full">
        <div className="grid gap-4 grid-cols-2">
          {listChaptersQuery.data?.map((chapter) => {
            return (
              <div
                key={chapter.id}
                className="card card-compact flex flex-row items-center bg-base-200 px-4 py-2"
              >
                <h4 className="card-title text-xl mr-auto">{chapter.title}</h4>

                <button
                  onClick={() => onRemoveChapter(chapter.id)}
                  className="btn btn-circle text-xl"
                >
                  <AiFillEdit className="fill-green-400" />
                </button>
                <div className="w-1" />
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
            <p className="text-center text-error text-xl">No chapters found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
