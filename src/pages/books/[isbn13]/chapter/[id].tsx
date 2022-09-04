import EditChapterForm from "components/EditChapterForm";
import Spinner from "components/Spinner";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import * as React from "react";
import { trpc } from "utils/trpc";

type LocalProps = {
  bookID: string;
  chapterID: string;
};

export const getServerSideProps: GetServerSideProps<LocalProps> = async (
  ctx
) => {
  const bookID = ctx?.params?.isbn13 as string;
  const chapterID = ctx?.params?.id as string;

  return {
    props: {
      bookID,
      chapterID,
    },
  };
};

const UpdateChapter = ({
  bookID,
  chapterID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const updateChapterMutation = trpc.useMutation(["books.update-chapter"]);
  const chapter = trpc.useQuery(["books.chapter", { chapterID }], {
    enabled: !!chapterID,
  });

  const onUpdateChapter = (chapterTitle: string, chapterText: string) => {
    updateChapterMutation.mutate({
      chapterID,
      payload: { title: chapterTitle, text: chapterText },
    });
  };

  if (chapter.isLoading) {
    return (
      <div className="h-full w-full flex flex-row justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!bookID || !chapterID) return null;

  return (
    <div className="w-full flex flex-col">
      <EditChapterForm
        initialText={chapter.data?.text}
        initialTitle={chapter.data?.title}
        bookID={bookID}
        onSubmit={onUpdateChapter}
        renderSubmitBtn={(onSubmit) => (
          <button
            onClick={onSubmit}
            disabled={updateChapterMutation.isLoading}
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Update chapter
          </button>
        )}
      />
    </div>
  );
};

export default UpdateChapter;
