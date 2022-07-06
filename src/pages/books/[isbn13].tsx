import React from "react";

import type { GetServerSideProps } from "next";

import { trpc } from "utils/trpc";
import { verifyJwt } from "utils/jwt";
import { fetchBook } from "utils/fetch";
import type { Book } from "types/books";

type LocalProps = {
  authenticated: boolean;
  user?: string;
  book: Book | null;
};

const BookDetail = ({ book, authenticated }: LocalProps) => {
  const mutation = trpc.useMutation(["books.add-book"]);

  const onClick = () => {
    if (!book) return;
    mutation.mutate({
      title: book.title,
      subtitle: book.subtitle,
      isbn13: book.isbn13,
      image: book.image,
      price: book.price,
    });
  };

  if (!authenticated) {
    return <div>cant be here</div>;
  }

  return (
    <button
      onClick={onClick}
      disabled={mutation.isLoading}
      className="btn btn-success"
    >
      add book
    </button>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<{ props: LocalProps }> => {
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

export default BookDetail;
