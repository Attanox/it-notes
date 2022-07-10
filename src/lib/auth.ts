// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { NextApiResponse } from "next";
import * as cookie from "cookie";

const SECRET = process.env.JWT_SECRET;

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
  const token = req.headers.get("token");

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
  try {
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(name)
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder().encode(SECRET));

    res.setHeader(
      "Set-cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours in seconds,
      })
    );
  } catch (e) {
    console.error({ setCookies: e });
  }
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "invalid", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
  );
}
