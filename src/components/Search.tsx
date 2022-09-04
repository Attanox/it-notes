import * as React from "react";

const Search = (props: {
  searchMutate: (a: { searchQuery: string; page?: number }) => void;
}) => {
  const searchRef = React.useRef<HTMLInputElement>(null);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current) {
      props.searchMutate({ searchQuery: searchRef.current.value, page: 1 });
    }
  };

  return (
    <form onSubmit={onSearch} className="flex items-end">
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
        type="submit"
        className="btn btn-primary btn-md btn-circle normal-case text-md gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-2xl"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  );
};

export default Search;
