import { PopulatedExhibitCreatable } from "@/types";
import styles from "./ExhibitTile.module.css";
import Image from "next/image";
import { useState } from "react";
import { Popup } from "@/components/general";
import Link from "next/link";
import { api } from "@/util/client";

export default function ExhibitTile({ 
  exhibit,
  onDelete,
  onTogglePublic
}: { 
  exhibit: PopulatedExhibitCreatable;
  onDelete: () => void;
  onTogglePublic: (exhibit: PopulatedExhibitCreatable) => void;
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
            <button onClick={() => {
              onTogglePublic(exhibit); 
            }}>
              {exhibit.published ? "Unpublish" : "Publish"}
            </button>
          <Link href={`/designer/${exhibit.title}`}>
            Edit
          </Link>
          <Link href={`/preview/${exhibit.title}`} target="_blank">
            Preview
          </Link>
        </div>
      </div>    
    </>
  )
}