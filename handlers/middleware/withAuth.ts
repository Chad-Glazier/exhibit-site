import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { TokenPayload, TokenPayloadSchema } from "@/types";
import cookie from "cookie";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default function withAuth(
  next: NextApiHandler
): NextApiHandler {
  return async function(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "This action requires an authorized user" });
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
      return next(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token or payload" });
    }
  }
}