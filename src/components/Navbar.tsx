import * as React from "react";
import Link from "next/link";

import { useAuthAPI, useAuthUser } from "context/auth";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

const AuthBtn = () => {
  const router = useRouter();
  const mutation = trpc.useMutation(["auth.logout"]);
  const { logoutUser } = useAuthAPI();
  const { user } = useAuthUser();

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
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="cursor-pointer">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-8 ring ring-primary ring-offset-base-100 ring-offset-2">
              <span className="text-lg">{user[0]?.trim()?.toUpperCase()}</span>
            </div>
          </div>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
        >
          <span className="w-full text-center text-md text-slate-200">
            {user}
          </span>
          <div className="divider mt-1 mb-2" />
          <button
            onClick={onClick}
            className="btn btn-error btn-sm normal-case text-base"
          >
            Logout
          </button>
        </ul>
      </div>
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
