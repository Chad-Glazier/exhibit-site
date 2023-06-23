import styles from "./AddYouTube.module.css";
import { Popup } from "@/components/general";
import { isYouTube } from "@/util";
import { useState } from "react";

export default function AddYouTube({
  show,
  onSubmit,
  onCancel
}: {
  show: boolean,
  onSubmit: (youtubeUrl: string) => void,
  onCancel: () => void
}) {
  const [isValid, setIsValid] = useState<boolean>(false);

  return (
    <Popup show={show} onClickAway={onCancel}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const url = (document.getElementById("youtube-url") as HTMLInputElement).value;
          onSubmit(url);  
        }}
      >
        <label 
          className={styles.label}
          htmlFor="youtube-url"
        >
          YouTube URL
        </label>
        <input
          className={styles.input + " " + (isValid ? styles.valid : styles.invalid)}
          type="text"
          id="youtube-url"
          name="youtube-url"
          placeholder="https://youtu.be/SBe8DgBCjTc"
          onChange={(e) => setIsValid(isYouTube(e.target.value))}
          required
        />
        <button 
          title={isValid ?
            "Use this YouTube video" :
            "Please enter a valid YouTube URL"
          }
          disabled={!isValid} 
          className={styles.button}
        >
          Use YouTube Video
        </button>
      </form>
    </Popup>
  );
}