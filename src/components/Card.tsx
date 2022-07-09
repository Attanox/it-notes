import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Book } from "types/books";
import { AiOutlineEdit } from "react-icons/ai";

const Card = (props: { book: Book; action?: boolean }) => {
  const { book, action = true } = props;

  return (
    <div className="card card-compact w-full min-h-fit shadow-x ">
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
          <div className="card-actions justify-end mt-auto">
            <Link href={`/books/${book.isbn13}`}>
              <a className="btn btn-primary btn-sm w-full gap-2">
                <AiOutlineEdit />
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
