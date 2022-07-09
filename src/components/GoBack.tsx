import Link from "next/link";
import React from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const GoBack = (props: { to?: string }) => {
  const { to = "/" } = props;

  return (
    <Link href={to}>
      <a className="btn btn-sm btn-outline gap-2">
        <IoChevronBackCircleOutline />
        Go back
      </a>
    </Link>
  );
};

export default GoBack;
