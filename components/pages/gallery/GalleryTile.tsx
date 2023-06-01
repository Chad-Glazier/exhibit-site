import styles from "./GalleryTile.module.css";
import Image from "next/image";
import { ImageType } from "@/types";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";
import { getBasename, getExtension } from "@/util";
import Details from "./Details";

export default function ExhibitTile({ 
  image,
  dependantExhibits,
  onDelete,
  openDetails
}: { 
  image: ImageType; 
  dependantExhibits: string[];
  onDelete?: () => void;
  openDetails?: boolean;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(openDetails ?? false);

  const imageBasename = decodeURIComponent(getBasename(image.url));

  return (
    <>
      <Details
        show={showDetails}
        onClose={() => setShowDetails(false)}
        imageName={imageBasename + getExtension(image.url)}
        imageUrl={image.url}
        dependantExhibits={dependantExhibits}
      />
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
          height={200}
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
          <button
            onClick={() => setShowDetails(true)}
            className={styles.imageButton + " " + styles.detailsButton}
          >
            View Details    
          </button>
        </div>
      </div>    
    </>
  )
}