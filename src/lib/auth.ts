// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { NextApiResponse } from "next";
import * as cookie from "cookie";

import { threeDaysInSec } from "utils/constants";

const SECRET = process.env.JWT_SECRET || "changeme";

export class AuthError extends Error {}

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export async function verifyJWT(token: string) {
  const authSession = await jwtVerify(token, new TextEncoder().encode(SECRET));
  return authSession.payload as UserJwtPayload;
}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) throw new AuthError("Missing user token");

  try {
    return await verifyJWT(token);
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(name: string, res: NextApiResponse) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setJti(name)
    .setIssuedAt()
    .setExpirationTime(threeDaysInSec)
    .sign(new TextEncoder().encode(SECRET));

  res.setHeader(
    "Set-cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      maxAge: threeDaysInSec,
    })
  );
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "invalid", {
      httpOnly: true,
      maxAge: 0,
    })
  );
}
