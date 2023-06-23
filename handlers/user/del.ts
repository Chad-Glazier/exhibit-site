import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { ErrorMessage, UserData } from "@/types";
import prisma from "@/prisma";
import jwt from "jsonwebtoken";

const jwtSecret: string = process.env.JWT_SECRET as string;

export default async function del(
  req: NextApiRequest,
  res: NextApiResponse<UserData | UserData[] | ErrorMessage>,
  authUser: UserData | null
) {
  if (authUser === null) {
    return res
      .status(403)
      .json({
        message: "The master key does not grant authorization for this endpoint. Try creating an account instead with the key, and then using that account to access this endpoint."
      })
  }

  let { email } = req.query;

  if (Array.isArray(email)) email = email.map(decodeURIComponent);
  else if (email && email !== "*") email = decodeURIComponent(email);

  if (email === "*") {
    if (!authUser.isMaster) {
      return res
        .status(403)
        .json({
          message: "Only an admin user can delete all accounts."
        });
    }

    const users: User[] = await prisma.user.findMany();
    await prisma.user.deleteMany();
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
    if (!authUser.isMaster) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to delete any account except your own."
        });
    }

    const users: User[] = await prisma.user.findMany({
      where: { email: { in: email }}
    });
    await prisma.user.deleteMany({
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

  if (authUser.email != email && !authUser.isMaster) {
    return res
      .status(403)
      .json({
        message: "Only an admin can delete the account of another user."
      });
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
  await prisma.user.delete({
    where: { email }
  });
  const { password, ...userData } = user;
  res.status(200).json(userData);
}
