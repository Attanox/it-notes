import React from "react";
import { AiFillDelete, AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import { verifyJwt } from "utils/jwt";
import { fetchBook } from "utils/fetch";
import Card from "components/Card";
import Link from "next/link";
import type { Book } from "types/books";
import GoBack from "components/GoBack";

type LocalProps = {
  authenticated: boolean;
  book: Book | null;
  user?: string;
};

export const getServerSideProps: GetServerSideProps<LocalProps> = async (
  ctx
) => {
  const book = ctx.params
    ? await fetchBook(ctx?.params?.isbn13 as string)
    : null;

  const token = ctx.req.cookies["token"] || "";

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
        <div className="flex flex-row">
          <GoBack />
          <Link href={`/books/${book.isbn13}/chapter/add`}>
            <a className="btn btn-sm btn-success gap-2 ml-auto">
              <AiOutlinePlusCircle />
              Add chapter
            </a>
          </Link>
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

                <button
                  onClick={() => onRemoveChapter(chapter.id)}
                  className="btn btn-circle text-xl"
                >
                  <AiFillEdit className="fill-green-400" />
                </button>
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
            <p className="text-center text-error text-xl">No chapters found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
