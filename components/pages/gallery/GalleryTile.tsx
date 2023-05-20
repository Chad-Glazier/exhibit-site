import styles from "./GalleryTile.module.css";
import Image from "next/image";
import { Image as ImageInterface } from "@prisma/client";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";
import { getBasename, getExtension } from "@/util";

export default function ExhibitTile({ 
  image,
  onDelete
}: { 
  image: ImageInterface; 
  onDelete?: () => void;
}) {
  const [showPopup, setShowPopup] = useState(false);

  const imageBasename = decodeURIComponent(getBasename(image.url));

  return (
    <>
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <div className={styles.popup}>
          <h2 className={styles.popupTitle}>
            Delete Image
          </h2>
          <p>
            Are you sure you want to delete &quot;{imageBasename}&quot;&#x3F;
          </p>
          <div className={styles.popupButtons}>
            <button 
              className={styles.button}
              onClick={() => {
                if (onDelete) onDelete();
                setShowPopup(false);
              }}
            >
              Delete
            </button>
            <button
              className={styles.button} 
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>        
          </div>
        </div>
      </Popup>
      <div className={styles.imageTile}>
        <h2 className={styles.imageTitle}>{imageBasename}</h2>
        <Image
          className={styles.imageThumbnail}
          src={image.url}
          alt={imageBasename}
          width={300}
          height={300}
        />
        <div className={styles.imageButtons}>
          <button
            className={styles.imageButton} 
            onClick={() => setShowPopup(true)}
          >
            Delete
          </button>
          <Link 
            className={styles.imageButton}
            target="_blank" href={image.url}
          >
            Download
          </Link>
          <Link
            className={styles.imageButton + " " + styles.detailsButton}
            href={`/gallery/${encodeURIComponent(imageBasename + getExtension(image.url))}`}
          >
            View Details    
          </Link>
        </div>
      </div>    
    </>
  )
}