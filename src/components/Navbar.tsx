import * as React from "react";
import Link from "next/link";

import { useAuth } from "context/auth";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

const AuthBtn = () => {
  const router = useRouter();
  const mutation = trpc.useMutation(["auth.logout"]);
  const { user, logoutUser } = useAuth();

  const onClick = () => {
    try {
      mutation.mutate();
      logoutUser();
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <Link href="/login">
        <a className="ml-auto btn btn-info btn-sm normal-case text-md">Login</a>
      </Link>
    );
  }

  return (
    <div className="w-fit ml-auto flex-row align-center justify-center">
      <span className="text-base text-slate-200">{user}</span>
      <div className="w-4" />
      <button
        onClick={onClick}
        className="btn btn-error btn-sm normal-case text-md"
      >
        Logout
      </button>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 px-0">
      <a className="normal-case text-xl">BookNotes</a>
      <AuthBtn />
    </div>
  );
};

export default Navbar;
