import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { useState } from "react";
import { Layout } from "@/components/layouts";
import { Swipeable, TextEditor, YouTubeEmbed } from "@/components/general";
import Image from "next/image";
import { getBasename, isYouTube } from "@/util";
import { Fragment } from "react";

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
        <Fragment key={index}>
          <Media
            key={index}
            mediaUrl={media}
            className={styles.media + " " + (index === activeIndex ? styles.active : "")}
            thumbnailOnly={index !== activeIndex}
          />
          <TextEditor
            key={index}
            className={styles.text + " " + (index === activeIndex ? styles.active : "")}
            innerClassName={styles.textInner}
            initialState={description}
            readonly
          />        
        </Fragment>
      ))}
      </Swipeable>
      <section
        className={styles.tiles}
      >
        {exhibit.cards.map(({ media, description }, index) => (
          <Media
            key={index}
            mediaUrl={media}
            className={styles.tile + " " + (index === activeIndex ? styles.active : "")}
            thumbnailOnly
            onClick={() => setActiveIndex(index)}
          />
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