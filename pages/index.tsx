import { ExhibitThumbnail } from "@/components";
import prisma from "@/prisma";
import { Exhibit } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import Header from "@/components/Header";

interface HomeProps {
  exhibitThumbnails: Exhibit[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const exhibitThumbnails: Exhibit[] = await prisma.exhibit.findMany({
    where: { published: true },
    include: { cards: false }
  });

  return { props: { exhibitThumbnails } };
}

export default function Home(
  { exhibitThumbnails }: HomeProps
) {
  return (
    <>
      <Header/>
      {exhibitThumbnails.map((exhibit, index) => <ExhibitThumbnail key={index} {...exhibit} />)}
    </>
  );
}
