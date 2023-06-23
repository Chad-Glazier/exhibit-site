import styles from "./DeleteCard.module.css";
import { Popup } from "@/components/general";
import { useState } from "react"; 

export default function DeleteCard({
  onClose,
  onDelete,
  show
}: {
  onClose: () => void;
  onDelete?: () => void;
  show: boolean;
}) {
  return (
    <Popup show={show} onClickAway={onClose}>
      <div className={styles.container}>
        <p>
          Are you sure you want to delete this card&#x3F;
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