import { createRouter } from "./context";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter()
  .mutation("signup", {
    input: z.object({
      name: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const { name, password } = input;

      const user = await prisma.user.create({
        data: {
          name: name,
          password: bcrypt.hashSync(password, 10),
        },
      });

      return { name: user.name };
    },
  })
  .mutation("login", {
    input: z.object({ name: z.string(), password: z.string() }),
    async resolve({ ctx, input }) {
      const { prisma } = ctx;

      const { name, password } = input;

      const user = await prisma.user.findUnique({
        where: {
          name: name,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (bcrypt.compareSync(password, user.password)) {
        return { name: user.name };
      } else {
        return null;
      }
    },
  });
