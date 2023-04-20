import { withAuth } from "@/components/hoc";
import { Dashboard, DashboardProps } from "@/components/pages";
import prisma from "@/prisma";
import { PopulatedExhibit } from "@/types";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const initialExhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({ include: { cards: true }});
  return { props: { initialExhibits } };
}

export default withAuth<DashboardProps>(Dashboard);