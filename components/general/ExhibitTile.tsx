import { PopulatedExhibitCreatable } from "@/types";
import styles from "./ExhibitTile.module.css";
import Image from "next/image";

export default function ExhibitTile({ exhibit }: { exhibit: PopulatedExhibitCreatable }) {

  return (
    <>
      <div>
        <h2 className={styles.heading}>{exhibit.title}</h2>
        <Image
          src={exhibit.thumbnail}
          alt={exhibit.title}
          width={300}
          height={300}
        />
        <p className={styles.description}>{exhibit.summary}</p>
      </div>    
    </>
  )
}