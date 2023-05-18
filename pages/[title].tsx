import { Exhibit } from "@/components/pages";
import { GetServerSideProps } from "next";
import { PopulatedExhibitCreatable } from "@/types";
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { title } = context.query;

  if (title === undefined || typeof title !== "string") {
    return {
      redirect: { destination: "/404", permanent: false }
    }
  }

  title = decodeURIComponent(title);
  const exhibit: PopulatedExhibitCreatable | null = await prisma.exhibit.findUnique({ 
    where: {
      title,
    },
    include: { cards: true }
  }) as PopulatedExhibitCreatable | null;

  if (!exhibit || !exhibit.published) {
    return {
      redirect: { destination: "/404", permanent: false }
    }
  }

  return {
    props: { exhibit }
  }
}

export default Exhibit;