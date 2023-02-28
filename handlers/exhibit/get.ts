import { 
    PopulatedExhibit, 
    ErrorMessage
} from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles a GET request to `/exhibit?id=<some_number>`. This endpoint can take either
 * a single `id` parameter, like `/exhibit?id=3`, or a series of them, like
 * `/exhibit?id=1&id=3`.
 * 
 * - If not given an `id`, sends back an `ErrorMessage` and status `400`.
 * - If one or more `id`s cannot be parsed to a `number`, sends back an
 *  ErrorMessage and status `400`.
 * - If the `id` is valid, but no matching `Exhibit` is found, sends back an 
 * ErrorMessage and status `404`.
 * - If given a series of `id`s and some match while others don't, it will send 
 * back the array of matching `PopulatedExhibit`s with status code `206`.
 * - If given a single `id` and no matching `Exhibit` is found, sends back an 
 * ErrorMessage and status `404`.
 * - If given a single `id` and a matching `Exhibit` is found, sends back the 
 * matching `PopulatedExhibit` and status `200`.
 * - If given a series of `id`s and all of them are found, sends back an array of 
 * the matching `PopulatedExhibit`s and status `200`.
 * 
 * @param req a `NextApiRequest` object
 * @param res a `NextApiResponse` object
 * @returns `void`
 */
export default async function get(
    req: NextApiRequest,
    res: NextApiResponse<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>
): Promise<void> {
    const { id } = req.query;

    if (!id) {
        res.status(400).json({
            message: `${req.method} requests to ${req.url ? new URL(req.url).pathname : "this address"} require an \`id\` parameter.`
        });
        return;
    }

    if (
        (!Array.isArray(id) && isNaN(parseInt(id))) ||
        (Array.isArray(id) && id.some((el: string) => isNaN(parseInt(el))))
    ) {
        res.status(400).json({
            message: "`id` parameters must be convertible to integers."
        });
        return;
    }

    const prisma = new PrismaClient();
    prisma.$connect();
    
    if (Array.isArray(id)) {
        let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
            where: {
                id: { in: id.map((el: string) => parseInt(el)) }
            },
            include: { cards: true }
        });
        res.status(
            exhibits.length === id.length ? 200 : 206
            ).json(exhibits);
        await prisma.$disconnect();
        return;
    }

    const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
        where: { id: parseInt(id) },
        include: { cards: true }
    });
    if (exhibit === null) {
        res.status(404).json({
            message: `No exhibit matches the \`id\` ${id}`
        });
        await prisma.$disconnect();
        return;
    }
    res.status(200).json(exhibit);            
    await prisma.$disconnect();
    return;
}