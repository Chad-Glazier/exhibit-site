import { ErrorMessage, PopulatedExhibit } from "@/types";
import { NextApiHandler } from "next";
import get from "./get";
import post from "./post";

const handlers: Record<string, NextApiHandler<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>> = {
    "GET": get,
    "POST": post
};

export default handlers;