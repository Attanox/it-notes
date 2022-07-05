import { useRouter } from "next/router";
import * as React from "react";
import { trpc } from "../utils/trpc";

const LogOutBtn = () => {
  const router = useRouter();
  const mutation = trpc.useMutation(["auth.logout"]);

  const onClick = () => {
    mutation.mutate();
  };

  if (!mutation.isLoading && mutation.data) {
    router.push("/login");
  }

  return (
    <button
      onClick={onClick}
      className="btn btn-error normal-case text-md ml-auto"
    >
      Logout
    </button>
  );
};

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 px-0  w-1/2 mx-auto">
      <a className="normal-case text-xl">BookNotes</a>
      <LogOutBtn />
    </div>
  );
};

export default Navbar;
