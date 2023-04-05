import { WithAuthProps, withAuth } from "@/components/hoc";
import ExhibitPage from "@/pages/exhibit/[title]";
import prisma from "@/prisma";
import { PopulatedExhibit } from "@/types";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const title: string | string[] | null = params?.title || null;

  if (!title || Array.isArray(title)) {
    return { props: { exhibit: null } };
  }

  const exhibit: PopulatedExhibit | null = await prisma.exhibit.findUnique({
    where: {
      title: decodeURIComponent(title)
    },
    include: { cards: true }
  });

  return { props: { exhibit, userData: null }};
}

export default withAuth(ExhibitPage);