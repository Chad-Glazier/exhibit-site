import React, { useState } from 'react';
import styles from "@/styles/UploadImagePopup.module.css";

interface UploadImagePopupProps {
  onUpload: (image: File) => void;
  onCancel: () => void;
}

export default function UploadImagePopup({ onUpload, onCancel }: UploadImagePopupProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      await onUpload(selectedFile);
      onCancel();
    }
  };

  return (
    <div className={styles.uploadImagePopup}>
      <div className={styles.overlay} onClick={onCancel}></div>
      <div className={styles.content}>
        <h2>Upload Image</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className={styles.actions}>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" disabled={!selectedFile}>
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
