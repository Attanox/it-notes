import { createRouter } from "./context";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { expireUserCookie, setUserCookie } from "lib/auth";

export const authRouter = createRouter()
  .mutation("signup", {
    input: z.object({
      name: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const { name, password } = input;

      try {
        const user = await prisma.user.create({
          data: {
            name: name,
            password: bcrypt.hashSync(password, 10),
          },
        });

        return { name: user.name };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (bcrypt.compareSync(password, user.password)) {
        setUserCookie(user.name, ctx.res);

        return { name: user.name };
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wrong name or password",
        });
      }
    },
  })
  .mutation("logout", {
    async resolve({ ctx }) {
      expireUserCookie(ctx.res);

      return true;
    },
  })
  .query("whoami", {
    resolve({ ctx }) {
      return ctx.user;
    },
  });
