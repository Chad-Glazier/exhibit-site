import { PopulatedExhibitCreatable } from "@/types";
import styles from "./ExhibitTile.module.css";
import Image from "next/image";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";

export default function ExhibitTile({ 
  exhibit,
  onDelete 
}: { 
  exhibit: PopulatedExhibitCreatable 
  /**
   * This prop is a callback that's invoked after the user clicks the "delete"
   * button and confirms the deletion.
   */ 
  onDelete: () => void
}) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <p>Are you sure you want to delete &quot;{exhibit.title}&quot;&#x3F;</p>
        <button onClick={() => {
          if (onDelete) onDelete();
          setShowPopup(false);
        }}>
          Delete
        </button>
        <button onClick={() => {
          setShowPopup(false);
        }}>
          Cancel
        </button>
      </Popup>
      <div>
        <h2 className={styles.heading}>{exhibit.title}</h2>
        <Image
          src={exhibit.thumbnail}
          alt={exhibit.title}
          width={300}
          height={300}
        />
        <div className={styles.buttons}>
          <button onClick={() => setShowPopup(true)}>
            Delete
          </button>
          <Link href={`/designer/${exhibit.title}`}>
            Edit
          </Link>
        </div>
      </div>    
    </>
  )
}