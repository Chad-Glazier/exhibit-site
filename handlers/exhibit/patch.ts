import prisma from "@/prisma";
import { ExhibitType, ExhibitSchema, ErrorMessage, UserData, CardCreatableSchema, CardType, PopulatedExhibit, CardCreatable, CardSchema } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

/**
 * An endpoint to update an exhibit.
 * 
 * @param req Must include a query parameter for the exhibit's original `title`, and a body with the
 * updated fields of the exhibit. Any omitted fields will remain unchanged. 
 * 
 * The body must either be a valid `ExhibitType`, or a valid `PopulatedExhibit` object. If the exhibit 
 * is *not* populated, then the cards associated with the exhibit will remain unchanged. If the 
 * exhibit *is* populated, then the cards associated with the exhibit will be updated to match the 
 * `cards` field of the body.
 * 
 * @param res 
 * | Status Code | Description |
 * | ----------- | ----------- |
 * | 200         | The exhibit was successfully updated. |
 * | 400         | The request body was invalid or the exhibit title was missing from the query string. |
 * | 403         | The master key was wrongly used to access this endpoint. |
 * | 404         | The exhibit was not found. |
 * | 500         | An error occurred while updating the exhibit. |
 * @param authUser 
 * @returns 
 */
export default async function patch(
  req: NextApiRequest,
  res: NextApiResponse<ExhibitType | PopulatedExhibit | ErrorMessage>,
  authUser: UserData | null
) {
  if (authUser === null) {
    return res
      .status(403)
      .json({
        message: "The master key does not grant authorization for this endpoint. Try creating an account instead with the key, and then using that account to access this endpoint."
      })
  }

  const { title } = req.query;

  if (!title) {
    return res
      .status(400)
      .json({ message: "Missing title in query string" });
  }

  if (Array.isArray(title)) {
    return res
      .status(400)
      .json({ message: "This endpoint only accepts one title at a time" });
  }

  const existingExhibit = await prisma.exhibit.findUnique({ where: { title }}) as ExhibitType | null;

  if (!existingExhibit) {
    return res
      .status(404)
      .json({ message: "Exhibit not found." });
  }

  const cards = z.array(CardCreatableSchema).safeParse(req.body.cards);
  const requestExhibit = ExhibitSchema.partial().safeParse(req.body);

  if (!requestExhibit.success) {
    return res
      .status(400)
      .json({ message: "Invalid exhibit sent." });
  }

  if (cards.success) {
    return updatePopulatedExhibit(existingExhibit, requestExhibit.data, cards.data, res);
  }

  return updateUnpopulatedExhibit(existingExhibit, requestExhibit.data, res);
}

async function updatePopulatedExhibit(
  existingExhibit: ExhibitType,
  inboundExhibit: Partial<ExhibitType>,
  cards: CardCreatable[],
  res: NextApiResponse<PopulatedExhibit | ErrorMessage>
) {
  await prisma.card.deleteMany({
    where: {
      exhibitId: existingExhibit.id,
    }
  });

  await prisma.card.createMany({
    data: cards.map(card => ({
      ...card,
      exhibitId: existingExhibit.id
    }))
  });

  await prisma.exhibit.update({
    where: { id: existingExhibit.id },
    data: inboundExhibit,
  });

  const updatedExhibit = (await prisma.exhibit.findUnique({
    where: { id: existingExhibit.id },
    include: { cards: true }
  })) as PopulatedExhibit;

  return res
    .status(200)
    .json(updatedExhibit);
}

async function updateUnpopulatedExhibit(
  existingExhibit: ExhibitType,
  inboundExhibit: Partial<ExhibitType>,
  res: NextApiResponse<ExhibitType | ErrorMessage>
) {
  await prisma.exhibit.update({
    where: { id: existingExhibit.id },
    data: inboundExhibit
  });

  const updatedExhibit = (await prisma.exhibit.findUnique({
    where: { id: existingExhibit.id },
    include: { cards: true }
  })) as PopulatedExhibit;

  return res
    .status(200)
    .json(updatedExhibit);
}