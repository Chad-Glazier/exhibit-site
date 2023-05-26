import styles from "./Layout.module.css";
import NavBar from "./NavBar";
import Head from "next/head";
import Banner from "./Banner";
import Footer from "./Footer";

export default function Layout({ 
  children,
  pageName
}: { 
  children: React.ReactNode;
  pageName?: string;
}) {
  return (
    <>
      <Head>
        <title>{`${pageName ? pageName + " | " : ""}The Museum & Archives of Vernon`}</title>
      </Head>
      <header className={styles.header}>
        <Banner />
        <NavBar />        
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  )
}