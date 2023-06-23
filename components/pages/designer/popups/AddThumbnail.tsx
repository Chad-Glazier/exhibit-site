import styles from "./AddThumbnail.module.css";
import { useState } from "react";
import { AddImage, Popup } from "@/components/general";
import { ImageType } from "@/types";
import { getBasename } from "@/util";

export default function AddThumbnail({
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

  return (
    <>
      <AddImage
        show={showUpload}
        onCancel={() => setShowUpload(false)}
        onUpload={(newUrl) => {
          onAdd(newUrl);
          setShowUpload(false)
        }}
      />
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
            Use Selected Image
          </button>
          <em style={{ margin: "-10px 0", paddingLeft: "1rem"}}>or</em>
          <button
            className={styles.uploadButton + " " + styles.button}
            onClick={e => {
              e.preventDefault();
              close();
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