import { PopulatedExhibitCreatable } from "@/types";
import styles from "./ExhibitTile.module.css";
import Image from "next/image";
import { useState } from "react";
import { LoadingOverlay } from "@/components/general";
import Link from "next/link";
import DeleteExhibit from "./popups/DeleteExhibit";
import TogglePublishExhibit from "./popups/TogglePublishExhibit";
import Details from "./popups/Details";

export default function ExhibitTile({ 
  exhibit,
  allExhibits,
  onDelete,
  onTogglePublic
}: { 
  exhibit: PopulatedExhibitCreatable;
  allExhibits: PopulatedExhibitCreatable[];
  onDelete: () => void;
  onTogglePublic: (exhibit: PopulatedExhibitCreatable) => void;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <DeleteExhibit
        show={showDelete && !loading}
        close={() => setShowDelete(false)}
        exhibit={exhibit}
        onDelete={onDelete}
      />
      <TogglePublishExhibit
        show={showPublish && !loading}
        close={() => setShowPublish(false)}
        exhibit={exhibit}
        onTogglePublic={() => {
          onTogglePublic(exhibit);
        }}
      />
      <Details
        allExhibits={allExhibits}
        show={showDetails && !loading}
        close={() => setShowDetails(false)}
        exhibit={exhibit}
      />
      <div className={styles.exhibitCard}>
        <h2 className={styles.exhibitTitle}>{exhibit.title}</h2>
        <Image
          src={exhibit.thumbnail}
          alt={exhibit.title}
          width={300}
          height={200}
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
          <button 
            className={styles.exhibitButton}
            onClick={() => setShowDetails(true)}
          >
            View Details
          </button>
        </div>
      </div>    
    </>
  );
}
