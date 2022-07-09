import * as React from "react";

const Pagination = (props: {
  numberOfPages: number;
  onPageChange: (page: number) => void;
}) => {
  const { numberOfPages, onPageChange } = props;
  const [active, setActive] = React.useState(1);

  const onClick = (page: number) => {
    setActive(page);
    onPageChange(page);
  };

  if (numberOfPages <= 1)
    return <p className="text-center text-xl my-2">That&apos;s all folks.</p>;

  return (
    <div key={numberOfPages} className="btn-group justify-center my-2">
      {new Array(numberOfPages).fill(0).map((p, idx) => {
        const pageNumber = idx + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onClick(pageNumber)}
            className={`btn ${pageNumber === active ? "btn-active" : ""}`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
