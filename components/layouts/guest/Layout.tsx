import styles from "./Layout.module.css";
import NavBar from "./NavBar";
import Head from "next/head";
import Banner from "./Banner";
import Footer from "./Footer";

export default function Layout({ 
  children,
  pageName,
  className
}: { 
  children: React.ReactNode;
  pageName?: string;
  className?: string;
}) {
  return (
    <>
      <Head>
        <title>{`${pageName ? pageName + " | " : ""}The Museum & Archives of Vernon`}</title>
      </Head>
      <header className={styles.header}>
        <Banner inAnExhibit={pageName !== "Exhibits"}/>
        <NavBar />        
      </header>
      <div 
        id="top"
      ></div>
      <main className={styles.main + (className ? " " + className : "")}>
        {children}
      </main>
      <Footer />
    </>
  )
}