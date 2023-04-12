import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { 
  ErrorMessage, TokenPayload, 
  TokenPayloadSchema,
  UserData,
  UserDataSchema
} from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/prisma";
import cookie from "cookie";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserData | ErrorMessage>
) {
  const token: string | undefined = cookie.parse(req.headers.cookie || "")["token"];
  if (!token) {
    return res.status(401).json({ message: "No authorization token found" });
  }
  try {
    const verifiedToken: JwtPayload | string = jwt.verify(token, jwtSecret);
    const { email }: TokenPayload = TokenPayloadSchema.parse(verifiedToken);
    const user: User | null = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ message: "Unrecognized user in token" });
    }
    const userData: UserData = UserDataSchema.parse(user);
    return res.status(200).json(userData);
  } catch {
    return res.status(400).json({ message: "Invalid token or payload" });
  }
}