import styles from "./GalleryTile.module.css";
import Image from "next/image";
import { ImageType } from "@/types";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";
import { getBasename, getExtension } from "@/util";
import Details from "./Details";
import DeleteImage from "./DeleteImage";

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
      <DeleteImage
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onDelete={onDelete}
        imageBasename={imageBasename}
      />  
      <div
        className={styles.tile}
        onClick={() => setShowDetails(true)}
      >
        <Image 
          className={styles.background}
          src={image.url}
          alt={imageBasename}
          width={300}
          height={300}
        />
        <h1 className={styles.title}>{imageBasename}</h1>
        <div className={styles.buttons}>
          <button
            className={styles.button} 
            onClick={e => {
              setShowPopup(true);
              e.stopPropagation();
            }}
          >
            Delete
          </button>
          <Link 
            className={styles.button}
            target="_blank" href={image.url}
            onClick={e => e.stopPropagation()}
          >
            Download
          </Link>
        </div>         
      </div>
    </>
  )
}