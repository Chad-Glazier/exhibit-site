import { PopulatedExhibitCreatable } from "@/types";
import { Popup } from "@/components/general";
import styles from "./DeleteExhibit.module.css";

/**
 *  A popup that prompts the user to confirm that they want to delete an exhibit.
 */
export default function DeleteExhibit({
  show,
  close,
  exhibit,
  onDelete,
}: {
  show: boolean;
  close: () => void;
  exhibit: PopulatedExhibitCreatable;
  onDelete: () => void;
}) {
  return (
    <Popup show={show} onClickAway={close}>
      <div className={styles.container}>
        <h2 className={styles.title}>Delete Exhibit</h2>
        <p>Are you sure you want to delete &quot;{exhibit.title}&quot;&#x3F;</p>
        <div className={styles.buttons}>
          <button 
            className={styles.button}
            onClick={() => {
              if (onDelete) onDelete();
              close();
            }}
          >
            Delete
          </button>
          <button 
            className={styles.button}
            onClick={() => {
              close();
            }}
          >
            Cancel
          </button>            
        </div>
      </div>
    </Popup>    
  )
}