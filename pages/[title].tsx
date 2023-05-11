import { Exhibit } from "@/components/pages";
import { GetServerSideProps } from "next";
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { title } = context.query;

  if (title === undefined || typeof title !== "string") {
    return {
      redirect: { destination: "/404", permanent: false }
    }
  }

  title = decodeURIComponent(title);
  const exhibit = await prisma.exhibit.findUnique({ where: { title }, include: { cards: true }});

  if (!exhibit) {
    return {
      redirect: { destination: "/404", permanent: false }
    }
  }

  return {
    props: { exhibit }
  }
}

export default Exhibit;