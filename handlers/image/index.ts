import { NextApiHandler } from "next/types";
import { ErrorMessage } from "@/types";
import post from "./post";
import del from "./del";
import get from "./get";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth, withImage } from "@/handlers/middleware";

const handlers: Record<string, NextApiHandler<any>> = {
  "POST": withAuth(withImage(post)),
  "DELETE": withAuth(del),
  "GET": get
};

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;