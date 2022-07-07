import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const bookID = ctx?.params?.isbn13 as string;

  console.log({ params: ctx?.params });

  return {
    props: {
      bookID,
    },
  };
};

const onChangeMD = MDEditor?.defaultProps?.onChange;
type TOnChangeMD = typeof onChangeMD;

const ChapterText = (props: {
  chapterText: React.RefObject<HTMLTextAreaElement>;
}) => {
  const [value, setValue] = React.useState("");

  const onChange: TOnChangeMD = (value, e) => {
    setValue(value || "");
    if (props.chapterText.current) {
      props.chapterText.current.value = value || "";
    }
  };

  return <MDEditor value={value} onChange={onChange} />;
};

const AddChapter = ({
  bookID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const addChapterMutation = trpc.useMutation(["books.add-chapter"]);

  const $chapterTitle = React.useRef<HTMLInputElement>(null);
  const $chapterText = React.useRef<HTMLTextAreaElement>(null);

  const onAddChapter = () => {
    if (!bookID) return;
    addChapterMutation.mutate({
      bookID: bookID,
      payload: {
        text: $chapterText.current?.value || "",
        title: $chapterTitle.current?.value || "",
      },
    });

    if ($chapterText.current?.value) $chapterText.current.value = "";
    if ($chapterTitle.current?.value) $chapterTitle.current.value = "";
  };

  console.log({ bookID });

  if (!bookID) return null;

  return (
    <div className="w-full flex flex-col">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Chapter name</span>
        </label>
        <input
          type="text"
          placeholder="Introduction"
          className="input input-bordered w-full max-w-xs"
          ref={$chapterTitle}
        />
      </div>

      <div className="w-full h-5" />

      <ChapterText chapterText={$chapterText} />

      <div className="w-full h-10" />

      <button
        onClick={onAddChapter}
        disabled={addChapterMutation.isLoading}
        className="btn btn-success w-32 ml-auto"
      >
        add chapter
      </button>
    </div>
  );
};

export default AddChapter;
