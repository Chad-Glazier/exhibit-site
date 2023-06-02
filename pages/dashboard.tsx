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

  const exhibits: PopulatedExhibit[] = 
    (await prisma.exhibit.findMany({
      include: { cards: true }
    }) as PopulatedExhibit[])
    .sort((a, b) => (
      b.priority - a.priority === 0 ?
        a.title.localeCompare(b.title) :
        b.priority - a.priority
  ));

  return { props: { exhibits, userData } };
}

export default Dashboard;