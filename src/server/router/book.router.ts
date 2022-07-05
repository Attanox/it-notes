import { createRouter } from "./context";
import { z } from "zod";
import { fetchBooks } from "../../utils/fetch";
import { TRPCError } from "@trpc/server";

export const booksRouter = createRouter()
  .query("newest", {
    input: z
      .object({
        last: z.number().nullish(),
      })
      .nullish(),
    async resolve({ input }) {
      const bookList = await fetchBooks("new");

      return bookList.books;
    },
  })
  .query("secret", {
    async resolve({ ctx }) {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot be here",
        });
      }
      return true;
    },
  });
