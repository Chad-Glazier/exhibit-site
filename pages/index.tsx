import { Home } from "@/components/pages";
import { GetServerSideProps } from "next";
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const exhibits = 
    (await prisma.exhibit.findMany({ where: { published: true }}))
    .sort((a, b) => (
        b.priority - a.priority === 0 ?
          a.title.localeCompare(b.title) :
          b.priority - a.priority
    ));

  return {
    props: { exhibits }
  }
}

export default Home;
