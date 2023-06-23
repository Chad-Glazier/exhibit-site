import { Gallery } from "@/components/pages";
import prisma from "@/prisma";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";
import { Image } from "@prisma/client";
import { getBasename } from "@/util";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }
    
  const imageTitles: Record<string, string[]> = {};

  const [images, allExhibits] = await Promise.all([
    prisma.image.findMany(),
    prisma.exhibit.findMany({ include: { cards: true } })
  ]);

  images.sort((a, b) => getBasename(a.url).localeCompare(getBasename(b.url)));

  for (const { url } of images) {
    imageTitles[url] = [];

    for (const { title, thumbnail, cards } of allExhibits) {
      if (
        thumbnail === url || 
        cards.map(({ media }) => media).includes(url)
      ) {
        if (!imageTitles[url].includes(title)) {
          imageTitles[url].push(title);
        }
      }
    }
  }

  let targetImage = context.query.image ?? null;
  
  if (Array.isArray(targetImage)) targetImage = targetImage[0];

  return { props: { images, imageTitles, userData, targetImage } };
} 

export default Gallery;