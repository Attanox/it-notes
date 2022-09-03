import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useWindowSize from "hooks/useWindowSize";
import GoBack from "./GoBack";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const onChangeMD = MDEditor?.defaultProps?.onChange;
type TOnChangeMD = typeof onChangeMD;

const ChapterText = (props: {
  setChapterText: (s: string) => void;
  initialText?: string;
}) => {
  const { initialText = "" } = props;

  const [value, setValue] = React.useState(initialText);
  const { height = 700 } = useWindowSize();

  const onChange: TOnChangeMD = (value, e) => {
    setValue(value || "");

    props.setChapterText(value || "");
  };

  // taken from inspecting
  const windowHeightMinusOtherElements = height - 84 - 64 - 20 - 32 - 40 - 10;

  return (
    <>
      <div className="hidden md:block">
        <MDEditor
          value={value}
          onChange={onChange}
          height={windowHeightMinusOtherElements}
        />
      </div>
      <div className="block md:hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ height: windowHeightMinusOtherElements }}
          className="w-full textarea textarea-bordered"
          placeholder="Type your notes"
        />
      </div>
    </>
  );
};

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
