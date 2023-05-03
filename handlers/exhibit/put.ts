import { PopulatedExhibit, ErrorMessage, ExhibitCreatable, ExhibitCreatableSchema, CardCreatable, CardCreatableSchema, PopulatedExhibitCreatable } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { z } from "zod";

export default async function put(
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

  let preExisting: PopulatedExhibit[] = await prisma.exhibit.findMany({
    where: { title: newExhibit.title },
    include: { cards: true }
  });

  if (preExisting.length > 0) {
    await prisma.card.deleteMany({
      where: {
        exhibitId: { in: preExisting.map(exhibit => exhibit.id) }
      }
    });
    await prisma.exhibit.deleteMany({
      where: {
        id: { in: preExisting.map(exhibit => exhibit.id) }
      }
    });
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

  console.log(createdExhibit);

  return res.status(201).json(createdExhibit);
}