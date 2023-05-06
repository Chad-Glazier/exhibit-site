import { Designer } from "@/components/pages";
import prisma from "@/prisma";
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
  const exhibit = await prisma.exhibit.findUnique({ where: { title } });

  if (!exhibit) {
    return { redirect: { destination: "/404_Admin", permanent: false } };
  }
  
  return {
    props: {
      originalExhibit: exhibit,
      userData
    }
  }
}

export default Designer;