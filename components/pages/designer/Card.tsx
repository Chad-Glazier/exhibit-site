import styles from "./Card.module.css";
import { CardType } from "@/types";
import { useState, useRef } from "react";
import AddMediaPopup from "./AddMediaPopup";
import Image from "next/image";
import dynamic from "next/dynamic";
import { isYouTube } from "@/util";
const TextEditor = dynamic(() => import("../../general/textEditor/TextEditor"), { ssr: false });
import { Image as ImageType } from "@prisma/client";
import { Popup, YouTubeEmbed } from "@/components/general";
import { getBasename } from "@/util";
import { Buttons } from "@/components/general";

export default function Card({
  card,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  allImages,
  acceptYouTube,
  id
}: {
  card: CardType;
  onChange: (updatedCard: CardType) => void;
  onDelete?: (updatedCard: CardType) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  allImages: ImageType[];
  acceptYouTube?: boolean;
  id?: string;
}) {
  const updatedCard = useRef<CardType>(card);
  const [showMediaPopup, setShowMediaPopup] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<ImageType[]>(allImages);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

  return (
    <>
      <Popup show={showDeletePopup} onClickAway={() => setShowDeletePopup(false)}>
        <div className={styles.popup}>
          <h2 className={styles.popupTitle}>Delete Card</h2>
          <p>
            Are you sure you want to delete this card?
          </p>
          <div className={styles.popupButtons}>
            <button
              className={styles.popupButton}
              onClick={() => {
                if (onDelete) onDelete(updatedCard.current);
                setShowDeletePopup(false);
              }}
            >
              Delete
            </button>
            <button
              className={styles.popupButton}
              onClick={() => setShowDeletePopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>
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
      <div className={styles.card} id={id}>
        {isYouTube(updatedCard.current.media) ?
          <YouTubeEmbed
            title="YouTube Video | Click to change"
            className={styles.image}
            onClick={() => setShowMediaPopup(true)} 
            src={updatedCard.current.media}
            height={200}
            width={356}
            thumbnailOnly
          />
        : <Image
            title={decodeURIComponent(getBasename(updatedCard.current.media)) + " | Click to change"}
            className={styles.image}
            onClick={() => setShowMediaPopup(true)}
            src={updatedCard.current.media}
            alt={updatedCard.current.media}
            width={356}
            height={200}
          />
        }
        <TextEditor 
          placeholder="Enter a description..."
          className={styles.editor}
          innerClassName={styles.editorInner}
          initialState={updatedCard.current.description}
          onChange={(editorState) => {
            updatedCard.current.description = JSON.stringify(editorState.toJSON());
            onChange(updatedCard.current);
          }}
        />
        <Buttons
          className={styles.buttons}
          onDelete={() => setShowDeletePopup(true)}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      </div>    
    </>
  );
}
