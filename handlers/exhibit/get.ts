import { PopulatedExhibit, ErrorMessage } from "@/types";
import prisma from "@/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<PopulatedExhibit | PopulatedExhibit[] | ErrorMessage>
): Promise<void> {
  const { id } = req.query;
  let { title } = req.query;

  if (Array.isArray(title)) title = title.map(decodeURIComponent);
  else if (title && title !== "*") title = decodeURIComponent(title);

  if (!id && !title) {
    res.status(400).json({
      message: `${req.method} requests to ${req.url ? new URL(req.url).pathname : "this address"} require an \`id\` or a \`title\` parameter.`
    });
    return;
  }

  if (id) {
    if (id === "*") {
      // get the exhibits for the response
      let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
        include: { cards: true }
      });
      // send the success response; this specific request cannot fail by definition
      res
        .status(200)
        .json(exhibits);
      return;
    }

    // handle the case where `id`(s) are present but not all of them are numbers.
    if (
      Array.isArray(id)
      ? id.some((item) => isNaN(parseInt(item)))
      : isNaN(parseInt(id))
    ) {
      res
        .status(400)
        .json({ message: `The \`id\` parameter(s) must be an integer` });
      return;
    }
    
    // handle the case where there are multiple `id`s
    if (Array.isArray(id)) {
      // Get the exhibits for the response body
      let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
        where: { id: { in: id.map(item => parseInt(item)) } },
        include: { cards: true }
      });

      // if all exhibits were found => 200 OK
      if (exhibits.length === id.length) {
        res
          .status(200)
          .json(exhibits);
      }

      // if no exhibits were found => 404 Not Found
      if (exhibits.length === 0) {
        res
          .status(404)
          .json({ message: "None of the listed items were found." });
      }

      // if some exhibits were found => 206 Partial Complete
      if (exhibits.length < id.length) {
        res
          .status(206)
          .json(exhibits);
      }

      return;
    }

    // get the exhibit for the response
    const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
      where: { id: parseInt(id) },
      include: { cards: true }
    });

    // if exhibit doesn't exist => 404 Not Found
    if (exhibit === null) {
      res.status(404).json({
        message: `No exhibit matches the \`id\` ${id}`
      });
      return;
    }

    // send a success response
    res.status(200).json(exhibit);   
  }

  if (title) {
    if (title === "*") {
      // get the exhibits for the response
      let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
        include: { cards: true }
      });
      // send the success response; this specific request cannot fail by definition
      res
        .status(200)
        .json(exhibits);
      return;
    }
    
    if (Array.isArray(title)) {
      // Get the exhibits for the response body
      let exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
        where: { title: { in: title } },
        include: { cards: true }
      });

      // if all exhibits were found => 200 OK
      if (exhibits.length === title.length) {
        res
          .status(200)
          .json(exhibits);
      }

      // if no exhibits were found => 404 Not Found
      if (exhibits.length === 0) {
        res
          .status(404)
          .json({ message: "None of the listed items were found." });
      }

      // if some exhibits were found => 206 Partial Complete
      if (exhibits.length < title.length) {
        res
          .status(206)
          .json(exhibits);
      }

      return;
    }

    // get the exhibit for the response
    const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
      where: { title: title },
      include: { cards: true }
    });

    // if exhibit doesn't exist => 404 Not Found
    if (exhibit === null) {
      res.status(404).json({
        message: `No exhibit matches the \`id\` ${id}`
      });
      return;
    }

    // send a success response
    res.status(200).json(exhibit);   
  }          
}