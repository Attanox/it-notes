import * as React from "react";
import { useRouter } from "next/router";
import GoBack from "components/GoBack";
import FileUpload from "./FileUpload";
import ChapterText from "./ChapterText";

type LocalProps = {
  initialTitle?: string;
  initialText?: string;
  bookID: string;
  onSubmit: (title: string, text: string) => void;
  renderSubmitBtn: (f: () => void) => React.ReactNode;
};

const EditChapterForm = (props: LocalProps) => {
  const {
    onSubmit,
    renderSubmitBtn,
    bookID,
    initialText = "",
    initialTitle = "",
  } = props;
  const router = useRouter();

  const $chapterTitle = React.useRef<HTMLInputElement>(null);
  const $chapterText = React.useRef<string>(initialText);

  const setChapterText = (s: string) => {
    $chapterText.current = s;
  };

  const onLocalSubmit = () => {
    if (!bookID) return;

    onSubmit($chapterTitle.current?.value || "", $chapterText.current || "");

    router.push(`/books/${bookID}`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-center">
        <div className="form-control w-full md:w-1/2">
          <label className="label" htmlFor="chapter-title">
            <span className="label-text">Chapter name</span>
          </label>
          <input
            type="text"
            id="chapter-title"
            placeholder="Introduction"
            className="input input-bordered w-full"
            key={initialTitle}
            defaultValue={initialTitle}
            ref={$chapterTitle}
          />
        </div>
        <div className="w-4 h-4" />
        <div className="form-control w-full lg:w-1/2">
          <FileUpload />
        </div>
      </div>

      <div className="w-full h-5" />

      <ChapterText
        initialText={initialText}
        setChapterText={setChapterText}
        key={initialText}
      />

      <div className="w-full h-10" />

      <div className="flex flex-row">
        <GoBack to={`/books/${bookID}`} />

        {renderSubmitBtn(() => onLocalSubmit())}
      </div>
    </>
  );
};

export default EditChapterForm;
