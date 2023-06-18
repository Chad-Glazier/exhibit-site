import { NextApiRequest, NextApiResponse } from "next/types";
import { User } from "@prisma/client";
import { ErrorMessage, UserData } from "@/types";
import prisma from "@/prisma";

export default async function get(
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
