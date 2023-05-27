import { PopulatedExhibit } from "@/types";
import styles from "./Thumbnail.module.css";
import { TextEditor } from "@/components/general";
import Image from "next/image";
import Link from "next/link";

export default function Thumbnail({
  exhibit
}: {
  exhibit: PopulatedExhibit;
}) {
  return (
    <div className={styles.tile}>
      <Link 
        className={styles.thumbnail}
        href={`/${encodeURIComponent(exhibit.title)}`}
      >
        <Image 
          src={exhibit.thumbnail} 
          alt="Thumbnail Image" 
          width={1000}
          height={1000}
        />
      </Link>
      <Link 
        className={styles.title}
        href={`/${encodeURIComponent(exhibit.title)}`}
      >
        <h1>{exhibit.title}</h1>
      </Link>
      <TextEditor
        className={styles.summary}
        innerClassName={styles.summaryInner}
        initialState={exhibit.summary}
        readonly={true}
      />
    </div>
  );
}