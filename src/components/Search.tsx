import * as React from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";

const Search = (props: {
  searchMutate: (a: { searchQuery: string; page?: number }) => void;
}) => {
  const searchRef = React.useRef<HTMLInputElement>(null);

  const onSearch = () => {
    if (searchRef.current)
      props.searchMutate({ searchQuery: searchRef.current.value });
  };

  return (
    <div className="flex items-end">
      <div className="form-control w-full relative">
        <label className="label" htmlFor="search">
          <span className="label-text">Search</span>
        </label>
        <input
          type="text"
          id="search"
          placeholder="Type here"
          className="input input-bordered"
          ref={searchRef}
        />
      </div>
      <div className="w-4" />
      <button
        onClick={onSearch}
        className="btn btn-primary btn-md btn-circle normal-case text-md gap-2"
      >
        <AiOutlineSearch className="text-2xl" />
      </button>
    </div>
  );
};

export default Search;
