import styles from "./ActiveCard.module.css";
import { CardCreatable } from "@/types";
import Image from "next/image";
import { isYouTube } from "@/util";
import { TextEditor } from "@/components/general";

export default function ActiveCard({
  card
}: {
  card: CardCreatable;
}) {
  return (
    <section>
      {isYouTube(card.media) ? 
        <iframe
          width="200"
          height="200"
          src={card.media}
          title={card.media}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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