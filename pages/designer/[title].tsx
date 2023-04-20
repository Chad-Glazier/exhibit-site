import { withAuth } from "@/components/hoc";
import { Designer, DesignerProps } from "@/components/pages";
import prisma from "@/prisma";
import { PopulatedExhibit } from "@/types";
import { GetServerSideProps } from "next";
import { Image } from "@prisma/client";

export const getServerSideProps: GetServerSideProps<DesignerProps> = async ({ params }) => {
  const title: string | string[] | null = params?.title || null;

  if (!title || Array.isArray(title)) {
    return { props: { exhibit: null, userData: null } };
  }

  const exhibit: PopulatedExhibit | null = await prisma.exhibit.findFirst({
    where: {
      title: decodeURIComponent(title)
    },
    include: { cards: true }
  });

  const imageCache: Image[] = (await prisma.image.findMany()) as Image[];

  return { props: { exhibit, imageCache, userData: null} };
}

export default withAuth<DesignerProps>(Designer);