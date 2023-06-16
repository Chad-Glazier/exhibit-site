import { ExhibitCreatable } from "@/types";
import styles from "./Carousel.module.css";
import Image from "next/image";
import Link from "next/link";
import { Swipeable, TextEditor } from "@/components/general";
import { useCallback, useEffect, useState } from "react";

export default function Carousel({
  className,
  exhibits
}: {
  className?: string;
  exhibits: ExhibitCreatable[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  const moveRight = useCallback(() => {
    setActiveSlide(prev => (prev + 1) % exhibits.length);
  }, [exhibits]);

  const moveLeft = useCallback(() => {
    setActiveSlide(prev => prev ? prev - 1 : exhibits.length - 1);
  }, [exhibits]);

  return (
    <>
      <Swipeable
        className={
          styles.carousel
          + (className ? ` ${className}` : "")
        }
        onSwipeLeft={moveRight}
        onSwipeRight={moveLeft}
      >
        {
          exhibits.map(({ title, summary, thumbnail}, index) => 
            <article
              key={title}
              className={styles.slide}
              data-position={
                activeSlide === index ? "center"
                : activeSlide > index ? "left"
                : "right"
              }
            >
              <Link
                key={title}
                href={`/${encodeURIComponent(title)}`}
              >
                <Image
                  className={styles.image}
                  src={thumbnail}
                  alt={title}
                  width={1920}
                  height={1000}
                  priority={true}
                />
                <div className={styles.text}>
                  <h1
                    className={styles.title}
                  >
                    {title}
                  </h1>
                  <TextEditor
                    className={styles.summary}
                    innerClassName={styles.summaryInner}
                    initialState={summary}
                    readonly={true}
                  />
                </div>
              </Link>
            </article>          
          )
        }
        <Image
          className={styles.arrowButton}
          onClick={e => {
            e.stopPropagation();
            moveLeft();
          }}
          src={"/arrow.svg"}
          alt="<"
          width={60}
          height={60}
          style={{ transform: "rotate(180deg)" }}
        />
        <Image
          className={styles.arrowButton}
          onClick={e => {
            e.stopPropagation();
            moveRight();
          }}
          src={"/arrow.svg"}
          alt="<"
          width={60}
          height={60}
        />
      </Swipeable>    
    </>

  )
}