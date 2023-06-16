import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { Layout } from "@/components/layouts";
import { useState } from "react";
import Carousel from "./Carousel";
import Tiles from "./Tiles";

export default function Exhibit({
  exhibit
}: {
  exhibit: PopulatedExhibitCreatable;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Layout 
      pageName={exhibit.title} 
      className={styles.background}
    >
      <Carousel 
        cards={exhibit.cards} 
        background={exhibit.thumbnail} 
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
      <Tiles
        cards={exhibit.cards}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
    </Layout>
  )
}
