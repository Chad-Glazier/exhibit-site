import style from "@/styles/Dashboard.module.css";
import prisma from "@/prisma";
import { Exhibit } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ExhibitThumbnail } from "@/components";
import { withAuth, WithAuthProps,  } from "../hoc";
import { UserData } from "@/types";

interface DashboardProps extends WithAuthProps {
  exhibitThumbnails: Exhibit[];
  userData: UserData | null;
}

function Dashboard(
  { exhibitThumbnails }: DashboardProps
) {
  return (
    <main className={style.main}>
      <h1 className={style.title}>Dashboard</h1>
      <div className={style.exhibitGrid}>
        {exhibitThumbnails.map((exhibit, index) => (
          <ExhibitThumbnail key={index} {...exhibit} designer />
        ))}
      </div>
    </main>
  );
}

export default withAuth(Dashboard);