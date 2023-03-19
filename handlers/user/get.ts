import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { ErrorMessage, UserData } from "@/types";
import prisma from "@/prisma";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserData | UserData[] | ErrorMessage>
) {
  const { email } = req.query;

  if (email === "*") {
    const users: User[] = await prisma.user.findMany();
    const userData: UserData[] = users.map(user => {
      const { password, ...userData } = user;
      return userData;
    }); 
    res.status(200).json(userData);
    return;
  }

  if (!email) {
    res.status(400).json({
      message: `${req.method} requests to ${req.url ? new URL(req.url).pathname : "this address"} require an \`email\` parameter.`
    });
    return;
  }

  if (Array.isArray(email)) {
    const users: User[] = await prisma.user.findMany({
      where: { email: { in: email }}
    });
    const userData: UserData[] = users.map(user => {
      const { password, ...userData } = user;
      return userData;
    }); 
    res
      .status(email.length = userData.length ? 200 : 206)
      .json(userData);
    return;
  }

  const user: User | null = await prisma.user.findUnique({
    where: { email }
  });
  if (user === null) {
    res.status(404).json({
      message: `No user matches the \`email\` ${email}`
    });
    return;
  }
  const { password, ...userData } = user;
  res.status(200).json(userData);
}