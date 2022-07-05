// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "./context";
import { authRouter } from "./auth.router";
import { booksRouter } from "./book.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("books.", booksRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
