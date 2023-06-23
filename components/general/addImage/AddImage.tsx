import styles from "./AddImage.module.css";
import { Popup, LoadingOverlay, Alert } from "@/components/general";
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <>
      <Alert message={alertMessage} setMessage={setAlertMessage} />
      <LoadingOverlay show={loading} />
      <Popup show={show && !loading} onClickAway={() => {
        setImagePreview(null);
        onCancel();
      }}>
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
              setAlertMessage(res.error);
            } else {
              setLoading(false);
              onUpload(res.body.url);
            }
          }}
        >
          <label htmlFor="image" className={styles.fileUploadLabel}>
            <Image
              className={(imagePreview ? styles.preview : styles.placeholder)}
              src={imagePreview || "/plus.svg"}
              alt="Add Image"
              width={250}
              height={250}
            />
          </label>
          <input 
            className={styles.input} 
            type="file" 
            id="image" name="image" 
            accept="image/*" 
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
          <button className={styles.button}>Upload</button>
        </form>
      </Popup>    
    </>
  );
}