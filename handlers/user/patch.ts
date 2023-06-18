import { NextApiRequest, NextApiResponse } from "next/types";
import { UserData, ErrorMessage, TokenPayload, UserSchema, UserType } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import { getCookieString } from "./authenticate/post";

export default async function put(
  req: NextApiRequest,
  res: NextApiResponse<UserData | ErrorMessage>,
  authUser: UserData | null
) {
  if (authUser === null) {
    return res
      .status(403)
      .json({
        message: "The master key does not grant authorization for this endpoint. Try creating an account instead with the key, and then using that account to access this endpoint."
      })
  }

  let jwtSecret: string;
  let saltRounds: number;

  try {
    jwtSecret = process.env.JWT_SECRET as string;
    saltRounds = parseInt(process.env.SALT_ROUNDS as string);
  } catch {
    return res.status(500).json({ 
      message: "The server could not get certain required environment variables. This is certainly due to a misconfiguration on the server." 
    });
  }

  let { user } = req.query;

  if (user === undefined) {
    return res
      .status(400)
      .json({ message: "A `user` must be specified by their email in the query string." });
  }

  if (user === "*") {
    return res
      .status(400)
      .json({
        message: "This endpoint does not support updating all users at once."
      });
  }

  if (Array.isArray(user)) {
    return res
      .status(400)
      .json({
        message: "This endpoint does not support updating multiple users at once."
      })
  }

  user = decodeURIComponent(user);

  if (!authUser.isMaster && user !== authUser.email) {
    return res
      .status(403)
      .json({
        message: "You are not authorized to update another user's data. Ask an administrator to do this for you."
      });
  }

  let parseUser = UserSchema.partial().safeParse(req.body);

  if (!parseUser.success) {
    return res
      .status(400)
      .json({
        message: "The request body did not match the required schema. Expected a `Partial<UserType>` object."
      });
  }

  let patchedUser = parseUser.data;


  if (patchedUser.password) {
    patchedUser.password = await bcrypt.hash(patchedUser.password, saltRounds);
  }

  if (patchedUser.email && patchedUser.email !== user) {
    const conflictingUser = await prisma.user.findUnique({ where: { email: patchedUser.email }});
    if (conflictingUser) {
      return res
        .status(409)
        .json({
          message: "That email address is already in use by another user.",
          ...conflictingUser
        });
    }
  }

  const currentUserData = await prisma.user.findUnique({ where: { email: user }});

  if (!currentUserData) {
    return res
      .status(404)
      .json({
        message: "No user with that email address (in the query string) exists."
      });
  }

  patchedUser.isMaster = currentUserData.isMaster;

  const updatedUser = await prisma.user.update({
    where: { email: user },
    data: patchedUser
  });

  const newUserData: UserType = await prisma.user.update({
    where: { email: user },
    data: patchedUser
  })

  // give the user a new token if they changed their email
  if (authUser.email === user && patchedUser.email !== user) {
    const tokenPayload: TokenPayload = { email: newUserData.email };
    const token: string = jwt.sign(tokenPayload, jwtSecret);

    return res
      .status(201)
      .setHeader("Set-Cookie", getCookieString(token))
      .json(newUserData);
  }

  return res
    .status(201)
    .json(newUserData);
}