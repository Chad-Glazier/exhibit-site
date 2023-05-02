import prisma from "@/prisma";
import { TokenPayload, TokenPayloadSchema, UserData, UserDataSchema } from "@/types";
import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const jwtSecret: string = process.env.JWT_SECRET as string;

/**
 * Used to check if a `cookie` object contains an authorized token.
 * The `cookie` object can be either the `cookies` field on a
 * `NextApiRequest`, or the `req.cookie` field of the context object
 * provided to a `GetServerSideProps` function.
 * 
 * E.g.,
 * 
 * to verify a valid cookie for a page request:
 * 
 * ```ts
 * export const getServerSideProps: GetServerSideProps = async (context) => {
 *  if (!(await authorized(context.req.cookies))) {
 *    return { redirect: { destination: "/login", permanent: false }};
 *  }
 *  // get the serverside props    
 * }
 * ```
 * 
 * to verify an API request instead:
 * 
 * ```ts
 *  if (!(await authorized(req.cookies))) {
 *    res.status(405).json({ message: "Unauthorized token." });
 *  }
 *  // handle the authenticated request
 * ```
 * 
 * @returns the `UserData` associated with the verified token, or
 * `null` if the token isn't verified.
 */
export default async function authorized(
  cookies: Partial<{[key: string]: string;}>
): Promise<UserData | null> {
  try {
    const token: string = cookies.token || "no token";
    const verifiedToken: JwtPayload | string = jwt.verify(token, jwtSecret);
    const { email }: TokenPayload = TokenPayloadSchema.parse(verifiedToken);
    const user: User | null = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) throw Error();
    const userData: UserData = UserDataSchema.parse(user);
    return userData;
  } catch {
    return null;
  }
}