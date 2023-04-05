import styles from "@/styles/FileUpload.module.css";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface FileUploadProps {
  preview?: boolean;
  previewHeight?: number;
  previewWidth?: number;
}

export default function FileUpload({
  preview,
  previewHeight,
  previewWidth  
}: FileUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [uploadData, setUploadData] = useState<ImageData | undefined>();

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = target.files;
    if (files === null) return;

    const image: File | null = files.item(0);
    if (image === null) return;

    const reader: FileReader = new FileReader();
    reader.onload = ({ target }) => {
      if (target) {
        setImageSrc(target.result as string);
      }
    }

    reader.readAsDataURL(image);
    sendImageToServer(image);
  }

  return (
    <div className={styles.container}>
      <input 
        type="file" 
        name="image-upload"
        accept="image/*"
        onChange={handleChange}
      />  
      {preview && imageSrc &&
        <Image 
          width={previewWidth ?? 200}
          height={previewHeight ?? 200} 
          src={imageSrc} 
          alt="Image Preview" 
        />        
      }
    </div>
  );
}

async function sendImageToServer(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/image", {
    method: "POST",
    body: formData
  });

  return await response.json();
}