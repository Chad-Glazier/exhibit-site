import { Home } from "@/components/pages";
import { GetServerSideProps } from "next";
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allExhibits = await prisma.exhibit.findMany({ include: { cards: true }});
  
  return {
    props: { allExhibits }
  }
}

export default Home;
