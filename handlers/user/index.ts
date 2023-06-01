import { NextApiHandler } from "next/types";
import { ErrorMessage, UserData } from "@/types";
import get from "./get";
import post from "./post";
import del from "./del";
import put from "./put";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth } from "@/handlers/middleware";

const handlers = new Map<string, NextApiHandler<ErrorMessage | UserData>>();
handlers.set("GET", withAuth(get));
handlers.set("POST", withAuth(post));
handlers.set("PUT", withAuth(put));
handlers.set("DELETE", withAuth(del));

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;