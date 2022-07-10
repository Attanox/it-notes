import EditChapterForm from "components/EditChapterForm";
import Spinner from "components/Spinner";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import * as React from "react";
import { AiFillEdit } from "react-icons/ai";
import { trpc } from "utils/trpc";
import { withAuth } from "utils/withAuth";

type LocalProps = {
  bookID: string;
  chapterID: string;
};

export const getServerSideProps: GetServerSideProps<LocalProps> =
  withAuth<LocalProps>(async (ctx) => {
    const bookID = ctx?.params?.isbn13 as string;
    const chapterID = ctx?.params?.id as string;

    return {
      props: {
        bookID,
        chapterID,
      },
    };
  });

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
            <AiFillEdit />
            Update chapter
          </button>
        )}
      />
    </div>
  );
};

export default UpdateChapter;
