import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import get from "./get";
import post from "./post";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth } from "@/handlers/middleware";

const handlers: Record<string, NextApiHandler<ErrorMessage | UserData>> = {
  "GET": withAuth(get),
  "POST": withAuth(post)
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;