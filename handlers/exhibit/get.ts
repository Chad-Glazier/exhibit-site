import { PopulatedExhibit, ErrorMessage } from "@/types";
import prisma from "@/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>
): Promise<void> {
  const { id } = req.query;

  if (id === "*") {
    let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
      include: { cards: true }
    });
    res.status(200).json(exhibits);
    return;
  }

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
    return;
  }

  res.status(200).json(exhibit);            
}