import styles from "./ActiveCard.module.css";
import { CardCreatable } from "@/types";
import Image from "next/image";
import { isYouTube } from "@/util";
import { TextEditor, YouTubeEmbed } from "@/components/general";

export default function ActiveCard({
  card
}: {
  card: CardCreatable;
}) {
  return (
    <section>
      {isYouTube(card.media) ? 
        <YouTubeEmbed
          src={card.media}
          height={200}
          width={200}
        />
        :
        <Image
          src={card.media}
          alt={card.media.split("/").pop() || "image"}
          width={200}
          height={200}
        />
      }

      <TextEditor
        /**
          * This `key` prop is necessary to force the TextEditor to re-render,
          * but it also introduces a bug when an exhibit includes two cards with
          * identical `media` values but distinct `description` values.
          * 
          * I'm willing to accept this potential bug because it is extremely unlikely,
          * and the bug itself will merely lead to the two cards sharing descriptions.
          */
        key={card.media}
        readonly         
        initialState={card.description}
      />
    </section>
  )
}