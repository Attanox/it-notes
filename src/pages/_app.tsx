// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import type { AppRouter } from "server/router/index.router";
import type { AppType } from "next/dist/shared/lib/utils";
import { AuthProvider, useAuth } from "context/auth";
import { getBaseUrl } from "utils/router";
import Navbar from "components/Navbar";
import "../styles/globals.css";
import { trpc } from "utils/trpc";
import Spinner from "components/Spinner";

const AppContent: AppType = ({ Component, pageProps }) => {
  const { loginUser } = useAuth();
  const query = trpc.useQuery(["auth.whoami"], {
    onSuccess(data) {
      console.log({ data });
      if (data) loginUser(data?.name);
    },
  });

  if (query.isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

const App: AppType = (props) => {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);
