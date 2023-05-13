import { GetServerSideProps } from "next";
import prisma from "@/prisma";
import { authorized } from "@/util/server";
import { Exhibit } from "@/components/pages";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  let { title } = context.query;

  if (title === undefined || typeof title !== "string") {
    return {
      redirect: { destination: "/404_Admin", permanent: false }
    }
  }

  title = decodeURIComponent(title);
  const exhibit = await prisma.exhibit.findUnique({ 
    where: {
      title,
    },
    include: { cards: true }
  });

  if (!exhibit) {
    return {
      redirect: { destination: "/404_Admin", permanent: false }
    }
  }

  return {
    props: { exhibit, userData }
  }
}

export default Exhibit;