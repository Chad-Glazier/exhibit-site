import styles from "./Home.module.css";
import { Layout } from "@/components/layouts";
import { PopulatedExhibit } from "@/types";
import Thumbnail from "./Thumbnail";
import Carousel from "./Carousel";

export default function Home({
  allExhibits
}: {
  allExhibits: PopulatedExhibit[];
}) {
  return (
    <Layout pageName="Exhibits">
      <main className={styles.home}>
        <Carousel 
          exhibits={allExhibits.slice(0, 5)}
        />
        {allExhibits.map(exhibit => 
          <Thumbnail 
            key={exhibit.title} 
            exhibit={exhibit} 
          />
        )}
      </main>
    </Layout>
  )
}