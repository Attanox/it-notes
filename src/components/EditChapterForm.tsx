import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useWindowSize from "hooks/useWindowSize";
import GoBack from "./GoBack";
import { getImageUrl, uploadImage } from "lib/supabase";
import Spinner from "./Spinner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading() {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  },
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

const FILES_ACCEPT = ".gif,.jpg,.jpeg";

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setLoading(true);
      const { data } = await uploadImage(selectedFile);
      if (data?.Key) setUploadedFile(data.Key);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center">
      <div className="form-control w-full max-w-xs flex flex-col items-start">
        <label className="label" htmlFor="image-upload">
          <span className="label-text">Upload file</span>
        </label>
        <input
          onChange={onUploadChange}
          type="file"
          accept={FILES_ACCEPT}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image-upload"
          name="image-upload"
          disabled={loading}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {FILES_ACCEPT}
        </p>
      </div>
      <div className="w-12" />
      <div className="ml-auto pt-2">
        {uploadedFile ? (
          <div className="flex flex-row justify-end items-center">
            <button
              type="button"
              className="btn btn-sm btn-ghost gap-2"
              disabled={loading}
              onClick={() =>
                navigator.clipboard.writeText(getImageUrl(uploadedFile))
              }
            >
              Copy URL
              {loading ? (
                <Spinner width="h-5" height="h-5" />
              ) : (
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
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
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
