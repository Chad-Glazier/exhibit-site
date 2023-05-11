import { Designer } from "@/components/pages";
import prisma from "@/prisma";
import { PopulatedExhibitCreatable } from "@/types";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {  
  const userData = await authorized(context.req.cookies);

  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  if (undefined === context.query.title) {
    return { redirect: { destination: "/designer", permanent: false } };
  }

  let title = Array.isArray(context.query.title) ? context.query.title[0] : context.query.title;
  title = decodeURIComponent(title);

  const allExhibits: PopulatedExhibitCreatable[] = await prisma.exhibit.findMany({
    include: { cards: true }
  });

  const originalExhibit = allExhibits.find(x => x.title === title);

  if (!originalExhibit) {
    return { redirect: { destination: "/404_Admin", permanent: false } };
  }

  const allImages = await prisma.image.findMany();
  
  return {
    props: {
      originalExhibit,
      userData,
      allExhibits,
      allImages
    }
  }
}

export default Designer;