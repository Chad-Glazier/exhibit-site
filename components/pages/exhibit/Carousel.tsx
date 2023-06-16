import styles from "./Carousel.module.css";
import { CardCreatable } from "@/types";
import { Swipeable, Media, TextEditor } from "@/components/general";
import { useCallback } from "react";
import Image from "next/image";

export default function Carousel({
  cards,
  background,
  activeIndex,
  onChange
}: {
  cards: CardCreatable[];
  background: string;
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const moveRight = useCallback(() => {
    onChange((activeIndex + 1) % cards.length);
  }, [activeIndex, cards.length, onChange]);

  const moveLeft = useCallback(() => {
    onChange((activeIndex ? activeIndex - 1 : cards.length - 1));
  }, [activeIndex, cards.length, onChange]);

  return (
    <Swipeable
      className={styles.carousel}
      onSwipeLeft={moveRight}
      onSwipeRight={moveLeft}
    >
      <Image
        className={styles.arrowButton}
        onClick={moveLeft}
        src={"/arrow.svg"}
        alt="<"
        width={60}
        height={60}
        style={{ transform: "rotate(180deg)" }}
      />
      <Image
        className={styles.arrowButton}
        onClick={moveRight}
        src={"/arrow.svg"}
        alt="<"
        width={60}
        height={60}
      />
      <Image
        className={styles.background}
        src={background}
        alt={""}
        height={1080}
        width={1920}
      />
      {
        cards.map(({ media, description }, index) => 
          <div
            key={index}
            className={styles.card}
            data-position={
              index === activeIndex ? "center" :
              index < activeIndex ? "left" : "right"
            }
          >
            <Media
              className={styles.media}
              url={media}
              active={index === activeIndex}
              alt={"card image"}
              height={800}
              width={1000}
            />
            <TextEditor
              className={styles.description}
              innerClassName={styles.descriptionInner}
              initialState={description}
              readonly={true}
            />
          </div>
        )
      }
    </Swipeable>
  );
}