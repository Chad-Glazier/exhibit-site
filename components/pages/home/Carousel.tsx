import styles from "./Carousel.module.css";
import { PopulatedExhibit } from "@/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TextEditor } from "@/components/general";
import { useRouter } from "next/router";

export default function Carousel({
  exhibits
}: {
  exhibits: PopulatedExhibit[]
}) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    exhibits.map(({ title }) => router.prefetch(`/${encodeURIComponent(title)}`));
  });

  return (
    <div className={styles.carousel}>
      <Image 
        className={styles.arrow}
        src="/arrow.svg"
        alt="<"
        height={32}
        width={32}
        style={{ transform: "rotate(180deg)" }}
        onClick={() => setCurrent(prev => {
          if (prev === 0) return exhibits.length - 1;
          return prev - 1;
        })}
      />
      {
        exhibits.map((exhibit, index) =>
          <article
            key={exhibit.title}
            data-status={index === current ? "center" : index > current ? "right" : "left"}
            className={styles.exhibit}
          >
            <Link 
              className={styles.thumbnail}
              href={`/${encodeURIComponent(exhibit.title)}`}
            >
            <Image
              className={styles.thumbnailImage}
              src={exhibit.thumbnail}
              alt={exhibit.title}
              height={1000}
              width={1000}
            />
            </Link>
            <Link
              className={styles.title}
              href={`/${encodeURIComponent(exhibit.title)}`}
            >
              {exhibit.title}
            </Link>
            <TextEditor
              key={exhibit.title}
              className={styles.summary}
              innerClassName={styles.summaryInner}
              initialState={exhibit.summary}
              readonly={true}
            />
          </article>
        )
      }
      <Image 
        className={styles.arrow}
        src="/arrow.svg"
        alt="<"
        height={32}
        width={32}
        onClick={() => setCurrent(prev => (prev + 1) % exhibits.length)}
      />
    </div>
  );
}