import * as React from "react";
import { useRouter } from "next/router";

import { useAuthAPI } from "context/auth";
import { trpc } from "utils/trpc";
import AuthForm from "components/AuthForm";

function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuthAPI();

  const mutation = trpc.useMutation(["auth.login"], {
    onSuccess: ({ name, token }) => {
      loginUser(name);
      router.push("/");
    },
  });

  return (
    <AuthForm
      name="Login"
      mutate={mutation.mutate}
      error={mutation.error}
      isLoading={mutation.isLoading}
    />
  );
}

export default LoginPage;
