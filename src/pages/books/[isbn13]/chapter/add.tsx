import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import EditChapterForm from "components/EditChapterForm";

type LocalProps = {
  bookID: string;
};

export const getServerSideProps: GetServerSideProps<LocalProps> = async (
  ctx
) => {
  const bookID = ctx?.params?.isbn13 as string;

  return {
    props: {
      bookID,
    },
  };
};

const AddChapter = ({
  bookID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const addChapterMutation = trpc.useMutation(["books.add-chapter"]);
  const book = trpc.useQuery(["books.get-book", { isbn13: bookID }], {
    enabled: !!bookID,
  });

  const onAddChapter = (chapterTitle: string, chapterText: string) => {
    addChapterMutation.mutate({
      bookID: String(book.data?.id),
      payload: {
        text: chapterText,
        title: chapterTitle,
      },
    });
  };

  if (!bookID || book.isLoading) return null;

  return (
    <div className="w-full flex flex-col">
      <EditChapterForm
        bookID={bookID}
        onSubmit={onAddChapter}
        renderSubmitBtn={(onSubmit) => (
          <button
            onClick={onSubmit}
            disabled={addChapterMutation.isLoading}
            className="btn btn-success btn-sm gap-2 ml-auto"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add chapter
          </button>
        )}
      />
    </div>
  );
};

export default AddChapter;
