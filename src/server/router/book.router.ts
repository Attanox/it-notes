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
  .mutation("add-book", {
    input: z.object({
      title: z.string(),
      subtitle: z.string().nullish(),
      isbn13: z.string(),
      price: z.string(),
      image: z.string(),
    }),
    async resolve({ ctx, input }) {
      const bookNote = await ctx.prisma.bookNote.create({
        data: {
          ...input,
          authorId: ctx.user?.id || "",
        },
      });

      console.log({ input, bookNote });

      return bookNote;
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
