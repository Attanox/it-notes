import * as React from "react";
import { useRouter } from "next/router";

import { trpc } from "utils/trpc";
import AuthForm from "components/AuthForm";

function LoginPage() {
  const router = useRouter();

  const mutation = trpc.useMutation(["auth.signup"], {
    onSuccess: () => router.push("/login"),
  });

  return (
    <AuthForm
      name="Register"
      mutate={mutation.mutate}
      error={mutation.error}
      isLoading={mutation.isLoading}
    />
  );
}

export default LoginPage;
