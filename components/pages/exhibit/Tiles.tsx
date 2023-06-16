import { CardCreatable } from "@/types";
import styles from "./Tiles.module.css";
import { Media } from "@/components/general";
import Link from "next/link";

export default function Tiles({
  cards,
  activeIndex,
  onChange
}: {
  cards: CardCreatable[];
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <section
      className={styles.tiles}
    >
      {
        cards.map(({ media }, index) =>
          <Link
            href="#top" // defined in `Layout`
            key={index}
            onClick={() => onChange(index)}
          >
            <Media
              active={false}
              url={media}
              className={
                styles.tile 
                + (index === activeIndex ? ` ${styles.active}` : "")
              }
            />            
          </Link>
        )
      }
    </section>
  );
}