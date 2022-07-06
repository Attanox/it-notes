import React from "react";
import { AiFillDelete } from "react-icons/ai";
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
  const addBookMutation = trpc.useMutation(["books.add-book"]);
  const addChapterMutation = trpc.useMutation(["books.add-chapter"]);
  const removeChapterMutation = trpc.useMutation(["books.remove-chapter"]);

  const listChaptersQuery = trpc.useQuery(
    ["books.list-chapters", { bookId: book?.isbn13 || "" }],
    { enabled: !!book }
  );

  const $chapterTitle = React.useRef<HTMLInputElement>(null);
  const $chapterText = React.useRef<HTMLTextAreaElement>(null);

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

  const onAddChapter = () => {
    if (!book) return;
    addChapterMutation.mutate({
      bookID: book.isbn13,
      payload: {
        text: $chapterText.current?.value || "",
        title: $chapterTitle.current?.value || "",
      },
    });

    if ($chapterText.current?.value) $chapterText.current.value = "";
    if ($chapterTitle.current?.value) $chapterTitle.current.value = "";
    listChaptersQuery.refetch();
  };

  const onRemoveChapter = (chapterID: string) => {
    if (!chapterID) return;
    removeChapterMutation.mutate({ chapterID });
    listChaptersQuery.refetch();
  };

  if (!authenticated) {
    return <div>cant be here</div>;
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={onAddBook}
        disabled={addBookMutation.isLoading}
        className="btn btn-success"
      >
        add book
      </button>
      <div className="h-5" />
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Chapter name"
          className="input w-full max-w-xs"
          ref={$chapterTitle}
        />
        <textarea
          className="textarea"
          placeholder="Notes for chapter"
          ref={$chapterText}
        />
        <button
          onClick={onAddChapter}
          disabled={addChapterMutation.isLoading}
          className="btn btn-success"
        >
          add chapter
        </button>
      </div>
      <div className="h-5" />
      <div className="flex flex-col">
        {listChaptersQuery.data?.map((chapter) => {
          return (
            <div key={chapter.id} className="flex flex-col">
              <h4 className="text-xl">{chapter.title}</h4>
              <h5 className="text-md">{chapter.text}</h5>
              <AiFillDelete
                className="fill-rose-400"
                onClick={() => onRemoveChapter(chapter.id)}
              />
            </div>
          );
        })}
        {!listChaptersQuery.data && (
          <p className="text-error">No Chapters found</p>
        )}
      </div>
    </div>
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
