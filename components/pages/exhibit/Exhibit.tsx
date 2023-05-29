import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { useState } from "react";
import { Layout } from "@/components/layouts";
import { Swipeable, TextEditor, YouTubeEmbed } from "@/components/general";
import Image from "next/image";
import { getBasename, isYouTube } from "@/util";

export default function Exhibit({
  exhibit
}: {
  exhibit: PopulatedExhibitCreatable;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Layout pageName={exhibit.title} className={styles.background}>
      <Swipeable 
        className={styles.article}
        onSwipeLeft={() => setActiveIndex(prev => (prev + 1) % exhibit.cards.length)}
        onSwipeRight={() => setActiveIndex(prev => prev ? prev - 1 : exhibit.cards.length - 1)}
      >
      {exhibit.cards.map(({ media, description }, index) => (
        <article 
          key={index}
          id={index.toString()}
        >
          <Media
            key={media + index}
            mediaUrl={media}
            className={styles.media + " " + (index === activeIndex ? styles.active : "")}
            thumbnailOnly={index !== activeIndex}
          />
          <TextEditor
            key={media + index + "text"}
            className={styles.text + " " + (index === activeIndex ? styles.active : "")}
            innerClassName={styles.textInner}
            initialState={description}
            readonly
          />        
        </article>
      ))}
      </Swipeable>
      <section
        className={styles.tiles}
      >
        {exhibit.cards.map(({ media }, index) => (
          <Media
            key={index}
            mediaUrl={media}
            className={styles.tile + " " + (index === activeIndex ? styles.active : "")}
            thumbnailOnly
            onClick={() => {
              // unfortunately, browsers will sometimes interrupt the scroll because of the re-render. I 
              // tried using a couple of specialized react libraries to scroll to the element, but even 
              // those had weird behavior (the scroll finished, but the speed was wildly inconsistent). 
              // I decided that this is just the best way to do it.
              const target = document.getElementById(index.toString());
              if (!target) {
                console.error(`Could not find the card for ${getBasename(exhibit.cards[index].media)}`);
                return;
              }
              target.scrollIntoView({
                behavior: "smooth",
                block: window.innerHeight > 600 && window.innerWidth > 600 ? "center" : "start"
              })
              setActiveIndex(index);
            }}/>
        ))}
      </section>
    </Layout>
  )
}

function Media({
  mediaUrl,
  className,
  thumbnailOnly,
  onClick
}: {
  mediaUrl: string;
  className: string;
  thumbnailOnly?: boolean;
  onClick?: () => void;
}) {
  if (isYouTube(mediaUrl)) {
    return <YouTubeEmbed 
      className={className}
      src={mediaUrl} 
      height={1000}
      width={1000}
      thumbnailOnly={thumbnailOnly}
      onClick={onClick}
    />;
  }
  return <Image
    className={className}
    src={mediaUrl}
    height={1000}
    width={1000}
    alt={getBasename(mediaUrl)}
    onClick={onClick}
  />;
}
