import { UserData, PopulatedExhibit, ErrorMessage, ExhibitCreatable, ExhibitCreatableSchema, CardCreatable, CardCreatableSchema, PopulatedExhibitCreatable } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { z } from "zod";

export default async function put(
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage | PopulatedExhibit>,
  authUser: UserData | null
): Promise<void> {
  if (authUser === null) {
    return res
      .status(403)
      .json({
        message: "The master key does not grant authorization for this endpoint. Try creating an account instead with the key, and then using that account to access this endpoint."
      })
  }

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
  }) as PopulatedExhibit[];

  if (preExisting.length > 0) {
    await prisma.card.deleteMany({
      where: {
        exhibitId: { in: preExisting.map(exhibit => exhibit.id) }
      }
    });
    await prisma.exhibit.deleteMany({
      where: {
        title: newExhibit.title 
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
  }) as PopulatedExhibit;      

    return res.status(201).json(createdExhibit);
}