import { UserData } from "@/types";
import styles from "./AdminLayout.module.css";
import AdminNav from "./AdminNav";
import Head from "next/head";

export default function AdminLayout({ 
  pageName, 
  userData, 
  children 
}: { 
  pageName: string;
  userData: UserData;
  children: React.ReactNode; 
}) {
  return (
    <>
      <Head>
        <title>{pageName + " | The Museum & Archives of Vernon"}</title>
      </Head>
      <AdminNav />
      <main className={styles.main} >
        {children}
      </main>
    </>
  )
}