import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { 
  Credentials, CredentialsSchema, 
  ErrorMessage, TokenPayload, UserData, UserDataSchema
} from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<UserData | ErrorMessage>
) {
  try {
    const { email, password }: Credentials = CredentialsSchema.parse(req.body);
    const user: User | null = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({
        message: "Unrecognized email"
      });
    }
    const correctPassword: boolean = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }
    const tokenPayload: TokenPayload = { email };
    const token: string = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "3d" });
    const userData: UserData  = UserDataSchema.parse(user);
    res.status(200)
      .setHeader("Set-Cookie", getCookieString(token))
      .json(userData);
  } catch {
    return res.status(400).json({ 
      message: "Failed to parse email and password from request body" 
    });
  }
}

export function getCookieString(token: string, ttl: number = 7): string {
  const expiration: string = new Date(Date.now() + ttl * 24 * 60 * 60 * 1000).toUTCString()
  return [
    `token=${token}; `,
    `SameSite=Strict; `,
    `Expires=${expiration}`
  ].join(" ");
}