import { ErrorMessage, PopulatedExhibit } from "@/types";
import { NextApiHandler } from "next";
import get from "./get";
import post from "./post";
import wrapper from "../wrapper";
import wrapHandlers from "../wrapper";

const handlers: Record<string, NextApiHandler<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>> = {
    "GET": get,
    "POST": post
};

const handler = wrapHandlers(handlers);

export default handler;