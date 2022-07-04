import * as React from "react";
import { trpc } from "../utils/trpc";

function LoginForm() {
  const $name = React.useRef<HTMLInputElement>(null);
  const $password = React.useRef<HTMLInputElement>(null);

  const mutation = trpc.useMutation(["auth.login"]);

  const handleLogin = async () => {
    const name = $name.current?.value || "";
    const password = $password.current?.value || "";

    const res = mutation.mutate({ name, password });

    if ($name.current) $name.current.value = "";
    if ($password.current) $password.current.value = "";

    console.log({ res });
  };

  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          ref={$name}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
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

    const res = mutation.mutate({ name, password });

    if ($name.current) $name.current.value = "";
    if ($password.current) $password.current.value = "";

    console.log({ res });
  };

  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          ref={$name}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
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
    </>
  );
}

function LoginPage() {
  return (
    <>
      <div className="w-64 mx-auto">
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
