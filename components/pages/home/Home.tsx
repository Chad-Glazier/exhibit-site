import styles from "./Home.module.css";
import { Layout } from "@/components/layouts";
import { PopulatedExhibit } from "@/types";
import Thumbnail from "./Thumbnail";

export default function Home({
  allExhibits
}: {
  allExhibits: PopulatedExhibit[];
}) {
  return (
    <Layout>
      <main className={styles.home}>
        <h1 className={styles.heading}>Home</h1>
        {allExhibits.map((exhibit, index) => 
          <Thumbnail key={index} exhibit={exhibit} />
        )}
      </main>
    </Layout>
  )
}