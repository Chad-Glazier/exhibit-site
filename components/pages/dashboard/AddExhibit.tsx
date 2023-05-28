import { PopulatedExhibitCreatable } from "@/types";
import styles from "./AddExhibit.module.css";
import { LoadingOverlay, Popup } from "@/components/general";
import { api } from "@/util/client";
import { useState } from "react";

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
              title: newTitle,
              summary: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
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
          <h1 className={styles.title}>Add Exhibit</h1>
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
          <button className={styles.submit}>Create</button>          
        </form>
      </Popup>    
    </>
  );
}