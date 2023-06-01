import { NextApiHandler } from "next/types";
import { ErrorMessage } from "@/types";
import post from "./post";
import del from "./del";
import get from "./get";
import aggregateHandlers from "@/handlers/aggregateHandlers";
import { withAuth, withImage } from "@/handlers/middleware";

const handlers = new Map<string, NextApiHandler<any>>();
handlers.set("POST", withAuth(withImage(post)));
handlers.set("DELETE", withAuth(del));
handlers.set("GET", get);

const handler: NextApiHandler = aggregateHandlers(handlers);

export default handler;