import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { useState } from "react";
import { Layout } from "@/components/layouts";
import { TextEditor, YouTubeEmbed } from "@/components/general";
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
    <Layout pageName={exhibit.title}>
      <article 
        className={styles.article}
      >
      {exhibit.cards.map(({ media, description }, index) => (
        <Fragment key={index}>
          <Media
            key={index}
            mediaUrl={media}
            className={styles.media + " " + (index === activeIndex ? styles.active : "")}
          />
          <TextEditor
            key={index}
            className={styles.text + " " + (index === activeIndex ? styles.active : "")}
            initialState={description}
            readonly
          />        
        </Fragment>
      ))}
      </article>
      <section
        className={styles.tiles}
      >
        {exhibit.cards.map(({ media, description }, index) => (
          <Media
            key={index}
            mediaUrl={media}
            className={styles.tile}
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
  onClick,
  status
}: {
  mediaUrl: string;
  className: string;
  thumbnailOnly?: boolean;
  onClick?: () => void;
  status?: "active" | "inactive";
}) {
  if (isYouTube(mediaUrl)) {
    return <YouTubeEmbed 
      className={className}
      src={mediaUrl} 
      height={thumbnailOnly ? 1000 : 400}
      width={thumbnailOnly ? 1000 : 400}
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