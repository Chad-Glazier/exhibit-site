import prisma from "@/prisma";
import { Dashboard } from "@/components/pages";
import { authorized } from "@/util/server";
import { GetServerSideProps } from "next";
import { PopulatedExhibit } from "@/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = await authorized(context.req.cookies);
  if (!userData) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const exhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({
    include: { cards: true }
  }) as PopulatedExhibit[];

  return { props: { exhibits, userData } };
}

export default Dashboard;