import styles from "./AddImage.module.css";
import { Popup, LoadingOverlay } from "@/components/general";
import { useState } from "react";
import { api } from "@/util/client";
import Image from "next/image";

export default function AddImage({
  show,
  onUpload,
  onCancel
}: {
  show: boolean;
  onUpload: (newImageUrl: string) => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={show && !loading} onClickAway={onCancel}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();

            setImagePreview(null);
            const imageInputElement = document.getElementById("image") as HTMLInputElement;
            const imageFiles = imageInputElement.files;
            if (!imageFiles || imageFiles.length === 0) {
              return;
            }

            const imageFile = imageFiles[0];
            setLoading(true);
            const res = await api.image.post(imageFile);

            if (!res.ok) {
              setLoading(false);
              onCancel();
              alert(res.error);
            } else {
              setLoading(false);
              onUpload(res.body.url);
            }
          }}
        >
          <h2 className={styles.title}>Add Image</h2>
          <label htmlFor="image" className={styles.fileUploadLabel}>
            <Image
              src={imagePreview || "/add.png"}
              alt="Add Image"
              width={250}
              height={250}
              style={{ objectFit: "contain", cursor: "pointer" }}
            />
          </label>
          <input 
            className={styles.input} 
            type="file" 
            id="image" name="image" 
            accept="image/" 
            onChange={(e) => {
              const imageFile = e.target.files ? e.target.files[0] : null;
              if (!imageFile || imageFile.length === 0) {
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                if (!reader.result || typeof reader.result !== "string") {
                  return;
                }
                setImagePreview(reader.result);
              }
              reader.readAsDataURL(imageFile);
            }}
          />
          <button className={styles.submit}>Upload</button>
        </form>
      </Popup>    
    </>
  );
}