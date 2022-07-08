import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

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

const ChapterText = (props: { setChapterText: (s: string) => void }) => {
  const [value, setValue] = React.useState("");

  const onChange: TOnChangeMD = (value, e) => {
    setValue(value || "");

    props.setChapterText(value || "");
  };

  return <MDEditor value={value} onChange={onChange} />;
};

const AddChapter = ({
  bookID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const addChapterMutation = trpc.useMutation(["books.add-chapter"]);
  const router = useRouter();

  const $chapterTitle = React.useRef<HTMLInputElement>(null);
  const $chapterText = React.useRef<string>("");

  const onAddChapter = () => {
    if (!bookID) return;
    console.log({ $chapterText: $chapterText.current });

    addChapterMutation.mutate({
      bookID: bookID,
      payload: {
        text: $chapterText.current || "",
        title: $chapterTitle.current?.value || "",
      },
    });

    if ($chapterTitle.current?.value) $chapterTitle.current.value = "";
    router.push(`/books/${bookID}`);
  };

  const setChapterText = (s: string) => {
    $chapterText.current = s;
  };

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

      <ChapterText setChapterText={setChapterText} />

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
