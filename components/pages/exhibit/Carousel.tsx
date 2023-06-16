import styles from "./Carousel.module.css";
import { CardCreatable } from "@/types";
import { Swipeable, Media, TextEditor } from "@/components/general";
import { useState, useCallback } from "react";
import Image from "next/image";

export default function Carousel({
  cards,
  background
}: {
  cards: CardCreatable[];
  background: string;
}) {
  const [activeCard, setActiveCard] = useState(0);

  const moveRight = useCallback(() => {
    setActiveCard(prev => (prev + 1) % cards.length);
  }, [cards]);

  const moveLeft = useCallback(() => {
    setActiveCard(prev => prev ? prev - 1 : cards.length - 1);
  }, [cards]);

  return (
    <Swipeable
      className={styles.carousel}
      onSwipeLeft={moveRight}
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
              index === activeCard ? "center" :
              index < activeCard ? "left" : "right"
            }
          >
            <Media
              className={styles.media}
              url={media}
              active={index === activeCard}
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