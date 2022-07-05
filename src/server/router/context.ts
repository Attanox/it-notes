// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import { verifyJwt } from "../../utils/jwt";
import { prisma } from "../db/client";

const getUserFromCookies = async (req: NextApiRequest) => {
  // get JWT `token` on cookies
  const token = req.cookies["token"] || "";

  try {
    // if token is invalid, `verify` will throw an error
    const payload = verifyJwt<{ name: string }>(token);

    // find user in database
    const user = await prisma.user.findUnique({
      where: {
        name: payload.name,
      },
    });

    return user;
  } catch (e) {
    return null;
  }
};

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const user = await getUserFromCookies(req);

  console.log({ user });

  return {
    req,
    res,
    prisma,
    user,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
