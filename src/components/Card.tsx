import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Book } from "types/books";

const Card = (props: { book: Book; action?: boolean }) => {
  const { book, action = true } = props;

  return (
    <div className="card card-compact w-full min-h-fit bg-base-200 shadow-x ">
      <figure className="w-full relative" style={{ minHeight: "250px" }}>
        <Image
          src={book.image}
          alt={"book"}
          width="100%"
          height="100%"
          layout="fill"
          objectFit="contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <h3 className="card-title font-normal text-lg">{book.subtitle}</h3>
        {action ? (
          <div className="card-actions justify-end mt-auto">
            <Link href={`/books/${book.isbn13}`}>
              <a className="btn btn-primary">Take notes!</a>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
