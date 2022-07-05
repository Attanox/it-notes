import React from "react";
import { trpc } from "../../utils/trpc";

const BookDetail = () => {
  const secret = trpc.useQuery(["books.secret"]);

  console.log({ secret });

  if (secret.isLoading) {
    return <div>loading...</div>;
  }

  if (secret.error) {
    return <div>cant be here</div>;
  }

  return <div>BookDetail</div>;
};

export default BookDetail;
