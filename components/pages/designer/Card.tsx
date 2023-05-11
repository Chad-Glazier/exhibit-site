import styles from "./Card.module.css";
import { CardCreatable } from "@/types";
import { useState, useRef } from "react";
import AddMediaPopup from "./AddMediaPopup";
import Image from "next/image";
import dynamic from "next/dynamic";
import { isYouTube } from "@/util";
const TextEditor = dynamic(() => import("../../general/textEditor/TextEditor"), { ssr: false });
import { Image as ImageType } from "@prisma/client";

export default function Card({
  card,
  onChange,
  onDelete,
  allImages
}: {
  card: CardCreatable;
  onChange: (updatedCard: CardCreatable) => void;
  onDelete?: (updatedCard: CardCreatable) => void;
  allImages: ImageType[];
}) {
  const updatedCard = useRef<CardCreatable>(card);
  const [showMediaPopup, setShowMediaPopup] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<ImageType[]>(allImages);
  
  return (
    <>
      <AddMediaPopup
        imageCache={imageCache}
        show={showMediaPopup}
        onClickAway={() => setShowMediaPopup(false)}
        onUrlSubmit={(newUrl) => {
          updatedCard.current.media = newUrl;
          setImageCache(prev => [...prev, { url: newUrl }]);
          setShowMediaPopup(false);
          onChange(updatedCard.current);
        }}
      />
      <div className={styles.card}>
        {isYouTube(updatedCard.current.media) ?
          <iframe
              width="200"
              height="200"
              src={updatedCard.current.media}
              title={updatedCard.current.media}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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