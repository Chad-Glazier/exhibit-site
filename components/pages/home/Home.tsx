import styles from "./Home.module.css";
import { Layout } from "@/components/layouts";

export default function Home() {
  return (
    <Layout>
      <main className={styles.home}>
        <h1 className={styles.heading}>Home</h1>
      </main>
    </Layout>
  )
}