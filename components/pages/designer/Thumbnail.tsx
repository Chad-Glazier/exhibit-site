import styles from "./Thumbnail.module.css";
import { TextEditor } from "@/components/general";
import Image from "next/image";
import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import AddThumbnail from "./popups/AddThumbnail";
import { ImageType } from "@/types";
import { isYouTube } from "@/util";

const Thumbnail = forwardRef(function Thumbnail({
  title,
  summary,
  thumbnail,
  existingImages,
  onNewImage,
}: {
  title: string;
  thumbnail: string;
  summary: string;
  existingImages: ImageType[];
  onNewImage: (newImage: ImageType) => void;
},
  ref: React.Ref<{
    title: string;
    thumbnail: string;
    summary: string;
  }>
) {
  const [currentThumbnail, setCurrentThumbnail] = useState(thumbnail);
  const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);
  const cache = useRef({
    title,
    thumbnail,
    summary
  });

  useEffect(() => {
    setCurrentThumbnail(thumbnail);
  }, [thumbnail]);

  useImperativeHandle(ref, () => cache.current);

  return (
    <>
      <AddThumbnail
        show={showThumbnailSelector}
        close={() => setShowThumbnailSelector(false)}
        onAdd={newThumbnail => {
          cache.current.thumbnail = newThumbnail;
          if (
            !isYouTube(newThumbnail)
            &&
            existingImages.find(image => image.url === newThumbnail) === undefined
          ) {
            onNewImage({ url: newThumbnail });
          }
          setShowThumbnailSelector(false);
          setCurrentThumbnail(newThumbnail);
        }}
        existingImages={existingImages}
      />
      <section
        className={styles.container}
      >
        <div
          className={styles.thumbnailSection}
          onClick={e => {
            setShowThumbnailSelector(true);
          }}
          title={"Click to change the thumbnail"}
        >
          <Image
            className={styles.thumbnail + " " + (showThumbnailSelector ? styles.active : "")}
            src={currentThumbnail}
            alt={title}
            width={1920}
            height={1000}
            priority={true}
          />
          <Image 
            src="/edit.svg"
            height={32}
            width={32}
            alt="Edit"
            className={styles.editThumbnailButton}
          />
        </div>
        <div className={styles.text}>
          <input
            className={styles.title}
            type="text"
            defaultValue={title}
            onClick={e => e.stopPropagation()}
            onChange={e => {
              cache.current.title = e.target.value;
            }}
          />
          <TextEditor
            className={styles.summary}
            innerClassName={styles.summaryInner}
            initialState={summary}
            readonly={false}
            onClick={e => e.stopPropagation()}
            onChange={newState => {
              cache.current.summary = JSON.stringify(newState);
            }}
          />
        </div>
      </section>    
    </>
  );
});

export default Thumbnail;
