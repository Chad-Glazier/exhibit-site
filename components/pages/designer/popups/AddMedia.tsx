import styles from "./AddMedia.module.css";
import { useState } from "react";
import { AddImage, AddYouTube, Popup } from "@/components/general";
import { ImageType } from "@/types";
import { getBasename } from "@/util";
import Image from "next/image";

export default function AddMedia({
  show,
  close,
  onAdd,
  existingImages
}: {
  show: boolean;
  close: () => void;
  onAdd: (url: string) => void;
  existingImages: ImageType[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);

  if (showUpload) {
    return <AddImage
      show={showUpload}
      onCancel={() => {
        setShowUpload(false);
        close();
      }}
      onUpload={(newUrl) => {
        onAdd(newUrl);
        setShowUpload(false);
        close();
      }}
    />;
  }

  if (showYouTube) {
    return <AddYouTube
      show={showYouTube}
      onCancel={() => {
        setShowYouTube(false)
        close();
      }}
      onSubmit={(url) => {
        onAdd(url);
        setShowYouTube(false);
        close();
      }}
    />;
  }

  return (
    <>
      <Popup
        show={show}
        onClickAway={close}
      >
        <form 
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            onAdd(selectedImage!);
            close();
          }}
        >
          <Image
            className={styles.exitButton}
            src="/plus.svg"
            height={40}
            width={40}
            alt="X"
            onClick={close}
          />
          <label className={styles.label} htmlFor="select-image">Select an Existing Image</label>
          <select
            id="select-image"
            name="select-image"
            className={styles.select}
            value={selectedImage ?? ""}
            onChange={e => {
              if (e.target.value === "") {
                setSelectedImage(null);
              } else {
                setSelectedImage(e.target.value);
              }
            }}
            required
          >
            <option value="">Select an Image</option>
            {existingImages.map(({ url }) =>
              <option
                key={url}
                value={url}
              >
                {decodeURIComponent(getBasename(url))}
              </option>
            )}
          </select>
          <button
            className={styles.button}
            onClick={undefined}
          >
            Select Image
          </button>
          <em style={{ margin: "-10px 0", paddingLeft: "1rem"}}>or</em>
          <button
            className={styles.button}
            onClick={e => {
              e.preventDefault();
              setShowYouTube(true);
            }}
          > 
            Select a YouTube Video
          </button>
          <em style={{ margin: "-10px 0", paddingLeft: "1rem"}}>or</em>
          <button
            className={styles.button}
            onClick={e => {
              e.preventDefault();
              setShowUpload(true)
            }}
          > 
            Upload a New Image
          </button>
        </form>
      </Popup>    
    </>

  )
}