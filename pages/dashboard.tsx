import { Dashboard } from "@/components/pages";
import { withAuth } from "@/components/hoc";
import { GetServerSideProps } from "next/types";
import prisma from "@/prisma";
import { Exhibit } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async () => {
  const exhibitThumbnails: Exhibit[] = await prisma.exhibit.findMany({
    include: { cards: false }
  });

  return { props: { exhibitThumbnails } };
}

export default withAuth(Dashboard);