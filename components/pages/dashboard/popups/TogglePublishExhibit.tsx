import { PopulatedExhibitCreatable } from "@/types";
import { Popup } from "@/components/general";
import styles from "./TogglePublishExhibit.module.css";

/**
 * A popup that prompts the user to confirm that they want to publish or unpublish an exhibit.
 */
export default function TogglePublishExhibit({
  show,
  close,
  exhibit,
  onTogglePublic
}: {
  show?: boolean;
  close: () => void;
  exhibit: PopulatedExhibitCreatable;
  onTogglePublic: () => void;
}) {
  return (
    <Popup show={show} onClickAway={close}>
      <div className={styles.container}>
        <h2 className={styles.title}>
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
          <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => {
              onTogglePublic();
              close();
            }}
          >
            {exhibit.published ? "Unpublish" : "Publish"}
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