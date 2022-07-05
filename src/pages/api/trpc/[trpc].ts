// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createContext } from "server/router/context";
import { appRouter } from "server/router/index.router";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
