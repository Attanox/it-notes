import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { trpc } from "utils/trpc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import GoBack from "components/GoBack";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useWindowSize from "hooks/useWindowSize";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

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

const onChangeMD = MDEditor?.defaultProps?.onChange;
type TOnChangeMD = typeof onChangeMD;

const ChapterText = (props: { setChapterText: (s: string) => void }) => {
  const [value, setValue] = React.useState("");
  const { height = 700 } = useWindowSize();

  const onChange: TOnChangeMD = (value, e) => {
    setValue(value || "");

    props.setChapterText(value || "");
  };

  // taken from inspecting
  const windowHeightMinusOtherElements = height - 84 - 64 - 20 - 32 - 40 - 10;

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      height={windowHeightMinusOtherElements}
    />
  );
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
      <div className="form-control w-1/2">
        <label className="label" htmlFor="chapter-title">
          <span className="label-text">Chapter name</span>
        </label>
        <input
          type="text"
          id="chapter-title"
          placeholder="Introduction"
          className="input input-bordered w-full"
          ref={$chapterTitle}
        />
      </div>

      <div className="w-full h-5" />

      <ChapterText setChapterText={setChapterText} />

      <div className="w-full h-10" />

      <div className="flex flex-row">
        <GoBack to={`/books/${bookID}`} />

        <button
          onClick={onAddChapter}
          disabled={addChapterMutation.isLoading}
          className="btn btn-success btn-sm gap-2 ml-auto"
        >
          <AiOutlinePlusCircle />
          Add chapter
        </button>
      </div>
    </div>
  );
};

export default AddChapter;
