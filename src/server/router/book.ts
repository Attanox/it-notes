import { createRouter } from "./context";
import { z } from "zod";
import { fetchBooks } from "../../utils/fetch";

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
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
