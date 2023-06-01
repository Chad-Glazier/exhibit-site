import { ErrorMessage, PopulatedExhibit } from "@/types";
import { NextApiHandler } from "next";
import get from "./get";
import post from "./post";
import put from "./put";
import del from "./del";
import patch from "./patch";
import aggregateHandlers from "../aggregateHandlers";
import { withAuth } from "../middleware";

const handlers = new Map<string, NextApiHandler<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>>();
handlers.set("GET", get);
handlers.set("POST", withAuth(post));
handlers.set("PUT", withAuth(put));
handlers.set("DELETE", withAuth(del));
handlers.set("PATCH", withAuth(patch));

const handler = aggregateHandlers(handlers);

export default handler;