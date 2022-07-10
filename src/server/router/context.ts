// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";

import { verifyJWT } from "lib/auth";
import { prisma } from "../db/client";

const getUserFromCookies = async (req: NextApiRequest) => {
  // get JWT `token` on cookies
  const token = req.cookies["token"] || "";

  try {
    // if token is invalid, `verify` will throw an error
    const payload = await verifyJWT(token).catch((err) => {
      console.error(err.message);
    });

    if (!payload) return null;

    // find user in database
    const user = await prisma.user.findUnique({
      where: {
        name: payload.jti,
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

  return {
    req,
    res,
    prisma,
    user,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
