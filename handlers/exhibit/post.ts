import { PopulatedExhibit, ErrorMessage, ExhibitCreatable, ExhibitCreatableSchema, CardCreatable, CardCreatableSchema, PopulatedExhibitCreatable } from "@/types";
import { Exhibit, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

/**
 * The server expects a `PopulatedExhibitCreatable` in the body of the 
 * request, otherwise sending back a `400` status code.
 * 
 * If the request body *does* properly parse to a `PopulatedExhibitCreatable`,
 * it will then check that the `title` is unique, otherwise sending back a
 * `409` status code and the body of the pre-existing `PopulatedExhibit` in
 * the response body.
 * 
 * If the request properly parses and the `title` is unique, it will insert
 * it to the database and send back a `201` status code with the newly created
 * `PopulatedExhibit`.
 * 
 * @param req a NextApiRequest object
 * @param res a NextApiResponse object
 */
export default async function post(
    req: NextApiRequest,
    res: NextApiResponse<ErrorMessage | PopulatedExhibit>
): Promise<void> {
    let newExhibit: ExhibitCreatable;
    let newCards: CardCreatable[];
    try {
        newExhibit = ExhibitCreatableSchema.parse(req.body);
        newCards = z.array(CardCreatableSchema).parse(req.body.cards);
    } catch {
        res.status(400).json({
            message: `The request body didn't contain an object that could be parsed to a \`PopulatedExhibitCreatable\`.`
        });
        return;
    }

    const prisma = new PrismaClient();
    prisma.$connect();

    let preExisting: PopulatedExhibit | null = await prisma.exhibit.findUnique({
        where: { title: newExhibit.title },
        include: { cards: true }
    });
    if (preExisting) {
        res.status(409).json({
            ...preExisting,
            message: "An exhibit with that `id` already exists."
        })
        prisma.$disconnect();
        return;
    }

    let createdExhibit: PopulatedExhibit = await prisma.exhibit.create({
        data: {
            ...newExhibit,
            cards: {
                create: newCards
            }
        },
        include: {
            cards: true
        }
    });
    res.status(201).json(createdExhibit);
    prisma.$disconnect();
}