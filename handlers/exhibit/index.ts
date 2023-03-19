import { ErrorMessage, PopulatedExhibit } from "@/types";
import { NextApiHandler } from "next";
import get from "./get";
import post from "./post";
import aggregateHandlers from "../aggregateHandlers";
import { withAuth } from "../middleware";

const handlers: Record<string, NextApiHandler<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>> = {
    "GET": get,
    "POST": withAuth(post)
};

const handler = aggregateHandlers(handlers);

export default handler;