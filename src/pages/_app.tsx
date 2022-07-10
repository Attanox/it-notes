// src/pages/_app.tsx
import superjson from "superjson";

import { withTRPC } from "@trpc/next";
import type { AppRouter } from "server/router/index.router";
import type { AppType } from "next/dist/shared/lib/utils";
import { AuthProvider, useAuthAPI } from "context/auth";
import { getBaseUrl } from "utils/router";
import Navbar from "components/Navbar";
import { trpc } from "utils/trpc";
import Spinner from "components/Spinner";

import "../styles/globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const AppContent: AppType = ({ Component, pageProps }) => {
  const { loginUser } = useAuthAPI();
  const query = trpc.useQuery(["auth.whoami"], {
    onSuccess(data) {
      console.log({ data });
      if (data?.name) loginUser(data?.name);
    },
  });

  return (
    <div className="w-1/2 min-h-screen mx-auto">
      {query.isLoading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Navbar />

          <Component {...pageProps} />
        </>
      )}
    </div>
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
