import { YouTubeEmbed } from "@/components/general";
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
        <YouTubeEmbed
          src={card.media}
          height={200}
          width={200}
          thumbnailOnly
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