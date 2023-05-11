import styles from "./CardTile.module.css";
import { CardCreatable } from "@/types";
import { isYouTube } from "@/util";
import Image from "next/image";

export default function CardTile({
  card,
  onClick
}: {
  card: CardCreatable;
  onClick: () => void;
}) {
  return  (
    <div onClick={onClick}>
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
    </div>
  )
}