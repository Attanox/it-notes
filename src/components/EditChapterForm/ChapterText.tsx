import React from "react";
import dynamic from "next/dynamic";

import Spinner from "components/Spinner";
import useWindowSize from "hooks/useWindowSize";

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

export default ChapterText;
