import style from "@/styles/Dashboard.module.css";
import prisma from "@/prisma";
import { Exhibit } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ExhibitThumbnail } from "@/components";

interface DashboardProps {
  exhibitThumbnails: Exhibit[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const exhibitThumbnails: Exhibit[] = await prisma.exhibit.findMany({
    include: { cards: false }
  });

  return { props: { exhibitThumbnails } };
}

export default function Dashboard(
  { exhibitThumbnails }: DashboardProps
) {
  return (
    <main className={style.main}>
      <h1>Dashboard</h1>
      {exhibitThumbnails.map((exhibit, index) => <ExhibitThumbnail key={index} {...exhibit} />)}
    </main>
  );
}