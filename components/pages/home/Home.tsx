import { Layout } from "@/components/layouts";
import styles from "./Home.module.css";
import Carousel from "./Carousel";
import { ExhibitCreatable } from "@/types";
import ExhibitTiles from "./ExhibitTiles";

export default function Home({
  exhibits
}: {
  exhibits: ExhibitCreatable[]
}) {
  return (
    <Layout
      pageName="Exhibits"
      className={styles.background}
    >
      <Carousel 
        className={styles.carousel}
        exhibits={exhibits.slice(0, 5)}
      />
      <ExhibitTiles
        className={styles.exhibitTiles}
        exhibits={exhibits}
      />
    </Layout>
  )
}