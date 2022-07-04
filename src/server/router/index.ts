// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { booksRouter } from "./book";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("books.", booksRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
