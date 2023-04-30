import { Dashboard, DashboardProps } from "@/components/pages";
import prisma from "@/prisma";
import { PopulatedExhibit } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext, NextPageContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  console.log(context.req.cookies.token);

  const initialExhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({ include: { cards: true }});
  return { props: { initialExhibits } };
}

export default Dashboard;