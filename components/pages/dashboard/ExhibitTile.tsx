import { PopulatedExhibitCreatable } from "@/types";
import styles from "./ExhibitTile.module.css";
import Image from "next/image";
import { useState } from "react";
import { Popup, LoadingOverlay } from "@/components/general";
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
  const [showDelete, setShowDelete] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={showDelete && !loading} onClickAway={() => setShowDelete(false)}>
        <div className={styles.popup}>
          <h2 className={styles.popupTitle}>Delete Exhibit</h2>
          <p>Are you sure you want to delete &quot;{exhibit.title}&quot;&#x3F;</p>
          <div className={styles.popupButtons}>
            <button 
              className={styles.button}
              onClick={() => {
                if (onDelete) onDelete();
                setShowDelete(false);
              }}
            >
              Delete
            </button>
            <button 
              className={styles.button}
              onClick={() => {
                setShowDelete(false);
              }}
            >
              Cancel
            </button>            
          </div>
        </div>
      </Popup>
      <Popup show={showPublish && !loading} onClickAway={() => setShowPublish(false)}>
        <div className={styles.popup}>
          <h2 className={styles.popupTitle}>
            {exhibit.published ? 
              "Unpublish Exhibit"
              :
              "Publish Exhibit"
            }
          </h2>
          <p>
            {exhibit.published ? 
              `Are you sure you want to unpublish "${exhibit.title}"? This will hide it from the public.` 
              : 
              `Are you sure you want to publish "${exhibit.title}"? This will make it visible to the public.`
            }
          </p>      
            <div className={styles.popupButtons}>
            <button
              className={styles.button}
              onClick={() => {
                onTogglePublic(exhibit);
                setShowPublish(false);
              }}
            >
              {exhibit.published ? "Unpublish" : "Publish"}
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setShowPublish(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>
      <div className={styles.exhibitCard}>
        <h2 className={styles.exhibitTitle}>{exhibit.title}</h2>
        <Image
          src={exhibit.thumbnail}
          alt={exhibit.title}
          width={300}
          height={300}
          className={styles.exhibitThumbnail}
        />
        <div className={styles.exhibitButtons}>
          <button
            className={styles.exhibitButton} 
            onClick={() => setShowDelete(true)}
          >
            Delete
          </button>
          <button
            className={styles.exhibitButton} 
            onClick={() => setShowPublish(true)}
          >
            {exhibit.published ? "Unpublish" : "Publish"}
          </button>
          <Link
            className={styles.exhibitButton} 
            href={`/designer/${encodeURIComponent(exhibit.title)}`}
            onClick={() => setLoading(true)}
          >
            Edit
          </Link>
          <Link 
            className={styles.exhibitButton}
            href={`/preview/${encodeURIComponent(exhibit.title)}`} 
            target="_blank"
          >
            Preview
          </Link>
        </div>
      </div>    
    </>
  );
}
