import prisma from "@/prisma";
import { ExhibitType, ExhibitSchema, ErrorMessage } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function patch(
  req: NextApiRequest,
  res: NextApiResponse<ExhibitType | ErrorMessage>
) {
  const { title } = req.query;

  if (!title) {
    return res
      .status(400)
      .json({ message: "Missing title" });
  }

  if (Array.isArray(title)) {
    return res
      .status(400)
      .json({ message: "This endpoint only accepts one title at a time" });
  }

  const requestExhibit = ExhibitSchema.safeParse(req.body);

  if (!requestExhibit.success) {
    return res
      .status(400)
      .json({
        message: "Invalid or invalid exhibit object."
      })
  }

  const { id, ...newDetails } = requestExhibit.data;

  try {
    const updatedExhibit = await prisma.exhibit.update({
      where: {
        title
      },
      data: newDetails
    }) as ExhibitType;

    return res
      .status(200)
      .json(updatedExhibit);
  } catch (e) {
    return res
      .status(404)
      .json({ message: "Exhibit not found." });
  }
}