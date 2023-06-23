import { UserData } from "@/types";
import styles from "./AdminLayout.module.css";
import AdminNav from "./AdminNav";
import Head from "next/head";

export default function AdminLayout({ 
  pageName, 
  userData, 
  children,
  onRedirect,
  className
}: { 
  pageName: string;
  userData: UserData;
  children: React.ReactNode;
  /**
   * A function that's invoked before the user attempts to redirect, and
   * determines whether or not to proceed with the redirect.
   * 
   * @returns Whether or not to redirect the user.
   */ 
  onRedirect?: (target: string) => boolean;
  className?: string;
}) {
  return (
    <>
      <Head>
        <title>{pageName + " | The Museum & Archives of Vernon"}</title>
      </Head>
      <AdminNav onRedirect={onRedirect} pageName={pageName} />
      <main className={styles.main + (className ? ` ${className}` : "")} >
        {children}
      </main>
    </>
  )
}