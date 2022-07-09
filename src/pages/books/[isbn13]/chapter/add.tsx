import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AiOutlinePlusCircle } from "react-icons/ai";

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

  const onAddChapter = (chapterTitle: string, chapterText: string) => {
    addChapterMutation.mutate({
      bookID: bookID,
      payload: {
        text: chapterText,
        title: chapterTitle,
      },
    });
  };

  if (!bookID) return null;

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
            <AiOutlinePlusCircle />
            Add chapter
          </button>
        )}
      />
    </div>
  );
};

export default AddChapter;
