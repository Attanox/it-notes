import { createRouter } from "./context";
import { z } from "zod";
import { fetchBooks } from "utils/fetch";

export const booksRouter = createRouter()
  .query("newest", {
    async resolve() {
      const bookList = await fetchBooks("new");

      return bookList.books;
    },
  })
  .mutation("search", {
    input: z.object({
      searchQuery: z.string(),
      page: z.number().nullish(),
    }),
    async resolve({ input }) {
      let query = `search/${input.searchQuery}`;
      if (input.page) {
        query = `${query}/${input.page}`;
      }

      const { total, books } = await fetchBooks(query);

      let pages = 1;
      if (total > 0) {
        pages = Math.ceil(Number(total) / Number(books.length));
      }

      return { books, pages };
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

      return chapter;
    },
  })
  .mutation("update-chapter", {
    input: z.object({
      chapterID: z.string(),
      payload: z.object({
        title: z.string(),
        text: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
      const chapter = await ctx.prisma.chapter.update({
        data: {
          ...input.payload,
        },
        where: {
          id: input.chapterID,
        },
      });

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
  .query("chapter", {
    input: z.object({
      chapterID: z.string(),
    }),
    async resolve({ ctx, input }) {
      const chapter = await ctx.prisma.chapter.findFirst({
        where: {
          id: input.chapterID,
        },
      });

      return chapter;
    },
  });
