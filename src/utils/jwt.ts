import jwt from "jsonwebtoken";
import { threeDaysInSec } from "./constants";

const SECRET = process.env.JWT_SECRET || "changeme";

export function signJwt<T extends object>(data: T) {
  return jwt.sign(data, SECRET, { expiresIn: threeDaysInSec });
}

export function verifyJwt<T>(token: string) {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch (e) {
    console.error(e);
  }
}
