import { TRPCError } from "@trpc/server";
import Link from "next/link";
import * as React from "react";

const AuthForm = (props: {
  name: "Login" | "Register";
  isLoading: boolean;
  mutate: ({ name, password }: { name: string; password: string }) => void;
  error: { message: string } | null;
}) => {
  const { error, isLoading, mutate, name } = props;

  const $name = React.useRef<HTMLInputElement>(null);
  const $password = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const name = $name.current?.value || "";
      const password = $password.current?.value || "";

      mutate({ name, password });

      if ($name.current) $name.current.value = "";
      if ($password.current) $password.current.value = "";
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit}
        className="block w-80 md:w-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-300 px-4 py-6 rounded box-content"
      >
        <h1 className="text-3xl text-center mb-2">{name}</h1>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            defaultValue={name === "Login" ? "Test" : ""}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            ref={$name}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            defaultValue={name === "Login" ? "1234" : ""}
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full"
            ref={$password}
          />
        </div>

        <div className="flex flex-row items-center justify-between mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary btn-md`}
          >
            Submit
          </button>

          <Link href={`/${name === "Login" ? "sign-up" : "login"}`}>
            <a className="link text-sm">
              {name === "Login" ? `Don't have an account?` : "Back to login"}
            </a>
          </Link>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg mt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error?.message}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
