import { ExhibitThumbnail } from "@/components";
import prisma from "@/prisma";
import { Exhibit } from "@prisma/client";
import { GetServerSideProps } from "next/types";

interface BrowserProps {
  exhibitThumbnails: Exhibit[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const exhibitThumbnails: Exhibit[] = await prisma.exhibit.findMany({
    where: { published: true },
    include: { cards: false }
  });

  return { props: { exhibitThumbnails } };
}

export default function Browser(
  { exhibitThumbnails }: BrowserProps
) {
  <h1>Browser</h1>
  {exhibitThumbnails.map((exhibit, index) => <ExhibitThumbnail key={index} {...exhibit} />)}
}