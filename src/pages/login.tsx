import { useRouter } from "next/router";
import * as React from "react";
import { trpc } from "../utils/trpc";

function LoginForm() {
  const router = useRouter();

  const $name = React.useRef<HTMLInputElement>(null);
  const $password = React.useRef<HTMLInputElement>(null);

  const mutation = trpc.useMutation(["auth.login"]);

  const handleLogin = async () => {
    const name = $name.current?.value || "";
    const password = $password.current?.value || "";

    mutation.mutate({ name, password });

    if ($name.current) $name.current.value = "";
    if ($password.current) $password.current.value = "";
  };

  if (!mutation.isLoading && mutation.data) router.push("/");

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
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
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full"
          ref={$password}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={mutation.isLoading}
        className="btn btn-primary mt-3"
      >
        Login
      </button>

      {mutation.error && (
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
            <span>{mutation.error?.message}</span>
          </div>
        </div>
      )}
    </>
  );
}

function SignUpForm() {
  const $name = React.useRef<HTMLInputElement>(null);
  const $password = React.useRef<HTMLInputElement>(null);

  const mutation = trpc.useMutation(["auth.signup"]);

  const handleSignup = async () => {
    const name = $name.current?.value || "";
    const password = $password.current?.value || "";

    mutation.mutate({ name, password });

    if ($name.current) $name.current.value = "";
    if ($password.current) $password.current.value = "";
  };

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
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
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full"
          ref={$password}
        />
      </div>

      <button
        onClick={handleSignup}
        disabled={mutation.isLoading}
        className="btn btn-secondary mt-3"
      >
        Create account
      </button>

      {mutation.error && (
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
            <span>{mutation.error?.message}</span>
          </div>
        </div>
      )}
    </>
  );
}

function LoginPage() {
  return (
    <>
      <div className="w-96 mx-auto">
        <div className="h-32" />

        <h1 className="text-lg">Login</h1>
        <LoginForm />

        <div className="h-32" />

        <h1 className="text-lg">Create account</h1>
        <SignUpForm />
      </div>
    </>
  );
}

export default LoginPage;
