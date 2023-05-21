import { Gallery } from "@/components/pages";
import prisma from "@/prisma";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";
import { Image } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const images: Image[] = await prisma.image.findMany();
  const imageTitles: Record<string, string[]> = {};

  for (const { url } of images) {
    imageTitles[url] = [];
    
    const allExhibits = await prisma.exhibit.findMany({ 
      include: { cards: true } 
    });

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

  return { props: { images, imageTitles, userData } };
} 

export default Gallery;