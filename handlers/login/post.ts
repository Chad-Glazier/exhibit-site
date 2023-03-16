import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/prisma";
import { 
  Credentials, CredentialsSchema, 
  ErrorMessage, 
  LoggedInCredentials, LoggedInCredentialsSchema 
} from "@/types";

export default function post(
  req: NextApiRequest,
  res: NextApiResponse<LoggedInCredentials | ErrorMessage>
) {
  try {
    const { sessionId } = LoggedInCredentialsSchema.parse(req.body);
    // handle pre-existing session
  } catch {
    try {
      const { email, password } = CredentialsSchema.parse(req.body);
      // handle email and password
    } catch {
      res.status(400).send({
        message: "Bad input; must have an email & password"
      });
    }
  }
}