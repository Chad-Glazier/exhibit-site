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
      <div className={styles.card}>
        <Image
          src={exhibit.thumbnail}
          alt={exhibit.title}
          width={1000}
          height={250}
          className={styles.thumbnail}
        />
        <Link
          href={`/preview/${encodeURIComponent(exhibit.title)}`}
          target="_blank"
        >
          <Image
            src={"/open.svg"}
            alt={"Open"}
            width={32}
            height={32}
            className={styles.open}
            title={"View Exhibit"}
          />        
        </Link>
        <div
          className={styles.details}
        >
          <Link
            href={`/preview/${encodeURIComponent(exhibit.title)}`}
            target="_blank"
          >
            <h2 className={styles.title}>{exhibit.title}</h2>
          </Link>
          <div className={styles.buttons}>
            <button
              className={styles.button} 
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button
              className={styles.button} 
              onClick={() => setShowPublish(true)}
            >
              {exhibit.published ? "Unpublish" : "Publish"}
            </button>
            <Link
              className={styles.button} 
              href={`/designer/${encodeURIComponent(exhibit.title)}`}
              onClick={() => setLoading(true)}
            >
              Edit
            </Link>
            <button 
              className={styles.button}
              onClick={() => setShowDetails(true)}
            >
              View Details
            </button>
          </div>          
        </div>
      </div>    
    </>
  );
}
