import { NextApiRequest, NextApiResponse } from "next/types";
import { UserData, ErrorMessage, TokenPayload } from "@/types";
import { User } from "@prisma/client";
import { UserSchema } from "@/prisma/zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import { getCookieString } from "./authenticate/post";

export default async function put(
  req: NextApiRequest,
  res: NextApiResponse<UserData | ErrorMessage>
) {
  let jwtSecret: string;
  let saltRounds: number;

  const dontLogIn = req.query.dontLogIn === "true";

  try {
    jwtSecret = process.env.JWT_SECRET as string;
    saltRounds = parseInt(process.env.SALT_ROUNDS as string);
  } catch {
    return res.status(500).json({ 
      message: "The server could not get certain required environment variables. This is certainly due to a misconfiguration on the server." 
    });
  }

  try {
    const { password, email, isMaster, ...otherUserData }: User = UserSchema.parse(req.body);

    const allUsers = await prisma.user.findMany();

    const preExistingUser = allUsers.find((user: User) => user.email === email);

    let wasMaster: boolean = false;
    if (preExistingUser) {
      const deletedUser = await prisma.user.delete({
        where: { email: preExistingUser.email }
      });
      wasMaster = deletedUser.isMaster;
    }

    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    
    try {
      await prisma.user.create({
        data: { 
          password: hashedPassword,
          email,
          isMaster: wasMaster,
          ...otherUserData
        }
      });
      const userData: UserData = { email, isMaster: wasMaster, ...otherUserData};
      const tokenPayload: TokenPayload = { email };
      const token: string = jwt.sign(tokenPayload, jwtSecret);
      if (dontLogIn) {
        res
          .status(201)
          .json(userData);
        return;
      }
      res
        .status(201)
        .setHeader("Set-Cookie", getCookieString(token))
        .json(userData);
    } catch {
      res.status(500).json({ message: "Unexpected server error prevented new user creation."});
    }
  } catch {
    res.status(400).json({ message: "Failed to parse a `User` from the request body."});
  }
}