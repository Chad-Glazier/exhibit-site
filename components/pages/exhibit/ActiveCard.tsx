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
          height={315}
          width={560}
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
        readonly={true}
        initialState={card.description}
      />
    </section>
  )
}