import { UserData, PopulatedExhibit, ErrorMessage, ExhibitCreatable, ExhibitCreatableSchema, CardCreatable, CardCreatableSchema, PopulatedExhibitCreatable } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { z } from "zod";

export default async function post(
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

  let preExisting: PopulatedExhibit | null = await prisma.exhibit.findUnique({
    where: { title: newExhibit.title },
    include: { cards: true }
  }) as PopulatedExhibit | null;

  if (preExisting) {
    res.status(409).json({
      ...preExisting,
      message: "An exhibit with that title already exists."
    })
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
  }) as PopulatedExhibit;

  return res.status(201).json(createdExhibit);
}