import { PopulatedExhibitCreatable } from "@/types";
import styles from "./AddExhibit.module.css";
import { LoadingOverlay, Popup } from "@/components/general";
import { api } from "@/util/client";
import { useState } from "react";
import { TextEditor } from "@/components/general";


/**
 * A popup form that prompts the user to create a new exhibit.
 */
export default function AddExhibit({
  show,
  existingExhibits,
  onCreate,
  onCancel
}: {
  show: boolean;
  existingExhibits: PopulatedExhibitCreatable[];
  onCreate: (newExhibit: PopulatedExhibitCreatable) => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={show && !loading} onClickAway={() => onCancel()}>
        <form
          className={styles.form} 
          onSubmit={async (e) => {
            e.preventDefault();

            const baseTitle = (document.getElementById("name") as HTMLInputElement).value;
            let newTitle = baseTitle;
            for (let i = 1; existingExhibits.map(el => el.title).includes(newTitle); i++) {
              newTitle = baseTitle + ` (${i})`;
            }
            const newExhibit: PopulatedExhibitCreatable = {
              priority: 0,
              title: newTitle,
              summary: TextEditor.emptyEditorState(),
              thumbnail: "/no-image.png",
              cards: [],
              published: false
            }
            setLoading(true);
            const res = await api.exhibit.post(newExhibit);
            if (!res.ok) {
              alert(res.error);
            } else {
              onCreate(newExhibit);
            }
            setLoading(false);
            onCancel();
          }}
        >
          <label 
            className={styles.label}
            htmlFor="name"
          >
            New Exhibit Title
          </label>
          <input 
            className={styles.input}
            type="text" 
            name="name" id="name" 
            required 
          />
          <div
            className={styles.buttons}
          >
            <button className={styles.button}>Create</button>    
            <button 
              className={styles.button}
              onClick={e => {
                e.preventDefault();
                onCancel();
              }}
            >
              Cancel
            </button> 
          </div>
        </form>
      </Popup>    
    </>
  );
}