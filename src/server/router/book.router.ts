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
  .mutation("add-chapter", {
    input: z.object({
      bookID: z.string(),
      payload: z.object({
        title: z.string(),
        text: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
      const chapter = await ctx.prisma.chapter.create({
        data: {
          ...input.payload,
          bookNoteId: input.bookID,
        },
      });

      console.log({ input, chapter });

      return chapter;
    },
  })
  .mutation("remove-chapter", {
    input: z.object({
      chapterID: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.chapter.delete({
        where: {
          id: input.chapterID,
        },
      });

      return true;
    },
  })
  .query("list-chapters", {
    input: z.object({
      bookId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const chapters = await ctx.prisma.bookNote
        .findFirst({
          where: {
            isbn13: input.bookId,
            authorId: ctx.user?.id,
          },
        })
        .chapters();

      return chapters;
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
