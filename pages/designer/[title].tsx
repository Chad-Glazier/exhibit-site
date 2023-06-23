import { Designer } from "@/components/pages";
import prisma from "@/prisma";
import { authorized } from "@/util/server";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

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

  const [allImages, originalExhibit, otherExhibitTitles] = await Promise.all([
    prisma.image.findMany(),
    prisma.exhibit.findUnique({ 
      where: { title }, 
      include: { cards: true } 
    }),
    prisma.exhibit.findMany({
      where: { title: { not: title }},
      select: { title: true }
    }).then(data => data.map(({ title }) => title))
  ]);

  if (originalExhibit === null) {
    return { redirect: { destination: "/404_Admin", permanent: false } };
  };

  return {
    props: {
      originalExhibit,
      userData,
      otherExhibitTitles,
      allImages
    }
  }
}

export default Designer;