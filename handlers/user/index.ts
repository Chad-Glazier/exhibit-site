import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import get from "./get";
import post from "./post";
import del from "./del";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth } from "@/handlers/middleware";

const handlers: Record<string, NextApiHandler<ErrorMessage | UserData>> = {
  "GET": withAuth(get),
  "POST": withAuth(post),
  "DELETE": withAuth(del)
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;