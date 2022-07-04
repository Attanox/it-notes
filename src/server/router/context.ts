// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = req.headers.authorization.split(" ")[1];
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  console.log({ user, headers: req.headers });

  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
