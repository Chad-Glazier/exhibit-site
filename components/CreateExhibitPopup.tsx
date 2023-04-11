import styles from "@/styles/CreateExhibitPopup.module.css";
import { useState } from "react";

interface CreateExhibitPopupProps {
  onCreate: (title: string) => void;
  onCancel: () => void;
}

export default function CreateExhibitPopup(
  { onCreate, onCancel }: CreateExhibitPopupProps
) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate(title);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Exhibit Title: </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.createButton}>
              Create
            </button>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
