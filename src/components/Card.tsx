import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Book } from "types/books";

const Card = (props: { book: Book; action?: boolean }) => {
  const { book, action = true } = props;

  return (
    <div
      className="card card-compact rounded border input-bordered w-full max-w-md min-h-fit"
      style={{ borderColor: "hsl(var(--bc) / var(--tw-border-opacity))" }}
    >
      <figure className="w-full relative" style={{ minHeight: "250px" }}>
        <Image
          src={book.image}
          alt={"book cover"}
          layout="fill"
          objectFit="contain"
        />
      </figure>
      <div className="divider my-0" />
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <h3 className="card-title font-normal text-lg">{book.subtitle}</h3>
        {action ? (
          <div className="card-actions justify-center mt-auto">
            <Link href={`/books/${book.isbn13}`}>
              <a className="max-w-md btn btn-primary btn-sm w-full gap-2">
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Take notes
              </a>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
