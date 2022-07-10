// eslint-disable-next-line @next/next/no-server-import-in-page
import { type NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "lib/auth";

export const config = {
  matcher: ["/my-notes", "/books/:path*"],
};

export async function middleware(req: NextRequest) {
  const verifiedToken = await verifyAuth(req).catch((err) => {
    console.error(err.message);
  });

  // redirect if the token is invalid
  // if (!verifiedToken) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return;
  // NextResponse.next();
}
