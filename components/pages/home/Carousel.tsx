import styles from "./Carousel.module.css";
import { PopulatedExhibit } from "@/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TextEditor, Swipeable } from "@/components/general";
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
    <Swipeable 
      className={styles.carousel}
      onSwipeLeft={() => setCurrent(prev => (prev + 1) % exhibits.length)}
      onSwipeRight={() => setCurrent(prev => prev ? prev - 1 : exhibits.length - 1)}
    >
      <div className={styles.indicator}>
        {exhibits.map(({ title }, index) => {
          return (
            <div 
              key={title}
              className={styles.dot}
              data-status={index === current ? "active" : "inactive"}
              onClick={() => setCurrent(index)}
            />
          );
        })}
      </div>
      <Image 
        className={styles.arrow}
        src="/arrow.svg"
        alt="<"
        height={32}
        width={32}
        style={{ transform: "rotate(180deg)" }}
        onClick={() => setCurrent(prev => prev ? prev - 1 : exhibits.length - 1)}
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
              className={styles.summary}
              innerClassName={styles.summaryInner}
              key={exhibit.title}
              initialState={exhibit.summary}
              readonly={true}
            />
          </article>
        )
      }
      <Image 
        className={styles.arrow}
        src="/arrow.svg"
        alt=">"
        height={32}
        width={32}
        onClick={() => setCurrent(prev => (prev + 1) % exhibits.length)}
      />
    </Swipeable>
  );
}
