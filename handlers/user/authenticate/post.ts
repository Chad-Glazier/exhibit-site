import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { 
  Credentials, CredentialsSchema, 
  ErrorMessage, TokenPayload, AuthenticUser, 
  AuthenticUserSchema 
} from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticUser | ErrorMessage>
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
    const authUser: AuthenticUser = AuthenticUserSchema.parse({ ...user, token});
    res.status(200).json(authUser);
  } catch {
    return res.status(400).json({ 
      message: "Failed to parse email and password from request body" 
    });
  }
}