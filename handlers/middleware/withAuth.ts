import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { NextApiAuthHandler, TokenPayload, TokenPayloadSchema } from "@/types";

const jwtSecret: string = process.env.JWT_SECRET as string;
const masterKey: string = process.env.MASTER_KEY as string;

/**
 * Middleware that verifies the user's authorization token before executing the wrapped
 * handler. If the token is invalid, the request will be rejected with a `401` error.
 * 
 * @param next the `NextApiHandler` to wrap
 * @returns a new `NextApiHandler` that will verify the user's authorization token before
 * executing `next`.
 */
export default function withAuth(
  next: NextApiAuthHandler
): NextApiHandler {
  return async function(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const authorization: string | undefined = req.headers.authorization;
    if (masterKey && authorization) {
      const existingUsers = await prisma.user.findMany();
      if (existingUsers.length > 0) {
        return res.status(401).json({ message: "The master key can only be used when no authorized users exist." });
      }
      if (authorization !== "Bearer " + masterKey) {
        return res.status(401).json({ message: "The `Authorization` header of the request didn't match the master key." });
      }
      return next(req, res, null);
    }
    const token: string | null = req.cookies.token || null;
    if (token === null) {
      return res.status(401).json({ message: "No authorization token found" });
    }
    try {
      const verifiedToken: JwtPayload | string = jwt.verify(token, jwtSecret);
      const tokenPayload: TokenPayload = TokenPayloadSchema.parse(verifiedToken);
      const user: User | null = await prisma.user.findUnique({
        where: { 
          email: tokenPayload.email
        }
      });
      if (!user) {
        return res.status(401).json({ message: "Unrecognized user in token" });
      }
      const { password, ...userData } = user;
      return next(req, res, userData);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token or payload" });
    }
  }
}