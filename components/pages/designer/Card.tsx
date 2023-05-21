import styles from "./Card.module.css";
import { CardCreatable } from "@/types";
import { useState, useRef } from "react";
import AddMediaPopup from "./AddMediaPopup";
import Image from "next/image";
import dynamic from "next/dynamic";
import { isYouTube } from "@/util";
const TextEditor = dynamic(() => import("../../general/textEditor/TextEditor"), { ssr: false });
import { Image as ImageType } from "@prisma/client";
import { YouTubeEmbed } from "@/components/general";

export default function Card({
  card,
  onChange,
  onDelete,
  allImages,
  acceptYouTube
}: {
  card: CardCreatable;
  onChange: (updatedCard: CardCreatable) => void;
  onDelete?: (updatedCard: CardCreatable) => void;
  allImages: ImageType[];
  acceptYouTube?: boolean;
}) {
  const updatedCard = useRef<CardCreatable>(card);
  const [showMediaPopup, setShowMediaPopup] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<ImageType[]>(allImages);
  
  return (
    <>
      <AddMediaPopup
        acceptYouTube={acceptYouTube}
        imageCache={imageCache}
        show={showMediaPopup}
        onClose={() => setShowMediaPopup(false)}
        onUrlSubmit={(newUrl) => {
          updatedCard.current.media = newUrl;
          if (!isYouTube(newUrl) && !imageCache.map(({ url }) => url).includes(newUrl)) {
            setImageCache(prev => [...prev, { url: newUrl }])
          }
          setShowMediaPopup(false);
          onChange(updatedCard.current);
        }}
      />
      <div className={styles.card}>
        {isYouTube(updatedCard.current.media) ?
          <YouTubeEmbed
            onClick={() => setShowMediaPopup(true)} 
            src={updatedCard.current.media}
            height={200}
            width={200}
            thumbnailOnly
          />
        : <Image
            onClick={() => setShowMediaPopup(true)}
            src={updatedCard.current.media}
            alt={updatedCard.current.media}
            width={200}
            height={200}
          />
        }
        <TextEditor 
          initialState={updatedCard.current.description}
          onChange={(editorState) => {
            updatedCard.current.description = JSON.stringify(editorState.toJSON());
            onChange(updatedCard.current);
          }}
        />
        {onDelete &&
          <button onClick={() => onDelete(updatedCard.current)}>
            Delete
          </button>
        }
      </div>    
    </>
  );
}