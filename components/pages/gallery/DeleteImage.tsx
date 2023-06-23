import styles from "./DeleteImage.module.css";
import { Popup } from "@/components/general";
import { useState } from "react"; 

export default function DeleteImage({
  onClose,
  onDelete,
  show,
  imageBasename
}: {
  onClose: () => void;
  onDelete?: () => void;
  show: boolean;
  imageBasename: string;
}) {
  return (
    <Popup show={show} onClickAway={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Delete Image
        </h2>
        <p>
          Are you sure you want to delete &quot;{imageBasename}&quot;&#x3F;
        </p>
        <div className={styles.buttons}>
          <button 
            className={styles.button}
            onClick={() => {
              if (onDelete) onDelete();
              onClose();
            }}
          >
            Delete
          </button>
          <button
            className={styles.button} 
            onClick={onClose}
          >
            Cancel
          </button>        
        </div>
      </div>
    </Popup>
  )
}