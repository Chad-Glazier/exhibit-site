import styles from "./GalleryTile.module.css";
import Image from "next/image";
import { Image as ImageInterface } from "@prisma/client";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";

export default function ExhibitTile({ 
  image,
  onDelete 
}: { 
  image: ImageInterface 
  /**
   * This prop is a callback that's invoked after the user clicks the "delete"
   * button, and confirms the deletion.
   */ 
  onDelete: () => void
}) {
  const [showPopup, setShowPopup] = useState(false);

  /**
   * images returned from the api will have `url`s that provide a complete
   * path to the image, but the user will only be concerned with the base
   * name.
   */
  const imageBasename = decodeURIComponent(image.url.split("/").pop() || "Unnamed");

  return (
    <>
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <p>Are you sure you want to delete &quot;{imageBasename}&quot;&#x3F;</p>
        <button onClick={() => {
          if (onDelete) onDelete();
          setShowPopup(false);
        }}>
          Delete
        </button>
        <button onClick={() => setShowPopup(false)}>
          Cancel
        </button>
      </Popup>
      <div>
        <h2 className={styles.heading}>{imageBasename}</h2>
        <Image
          src={image.url}
          alt={imageBasename}
          width={300}
          height={300}
        />
        <div className={styles.buttons}>
          <button onClick={() => setShowPopup(true)}>
            Delete
          </button>
          <Link target="_blank" href={image.url}>
            Download
          </Link>
        </div>
      </div>    
    </>
  )
}