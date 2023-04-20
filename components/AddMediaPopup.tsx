import styles from "@/styles/AddMediaPopup.module.css";
import React, { ChangeEvent, useState } from "react";
import { UploadImagePopup, ErrorPopup } from "@/components";
import { Image } from "@prisma/client";
import path from "path";

interface AddMediaPopupProps {
  mediaCache: string[];
  onAddMedia: (url: string) => void;
  onCancel: () => void;
  acceptYoutube?: boolean;
}

export default function AddMediaPopup({ 
  onAddMedia, onCancel, mediaCache, acceptYoutube
}: AddMediaPopupProps) {
  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mostRecentModified, setMostRecentModified] = useState<"image" | "youtube" | null>(null);

  if (errorPopup) {
    return <ErrorPopup 
      message="An error occurred and prevented the image from being uploaded. Please try again." 
      onOkay={() => setErrorPopup(false)}
    />;
  }

  if (uploadImage) {
    return <UploadImagePopup
      onUpload={async (image: File) => {
        const res = await sendImageToServer(image);
        if (!res.ok) {
          setErrorPopup(true);
          setUploadImage(false);
          return;
        }
        const newImage = await res.json() as Image;
        setUploadImage(false);
        onAddMedia(newImage.url);
        return;
      }}
      onCancel={() => {
        setUploadImage(false);
        onCancel();
      }}
    />;
  }

  return (
    <div className={styles.overlay}>
      <main className={styles.main}>
        <p>Choose one of the following types of media to include in the card.</p>
        <hr />
        <label htmlFor="existing-image">Select an Existing Image</label>
        <select name="existing-image" className={styles.input}>
          <option value="New Image" onClick={() => {
            setSelectedImage(null);
            setMostRecentModified(null);
          }}>
            New Image    
          </option>
          {mediaCache.map(url => 
            <option 
              value={url}
              onClick={() => {
                setSelectedImage(url);
                setMostRecentModified("image");
              }}
            >
              {path.basename(url)}
            </option>
          )}
        </select>
        <hr />
        {acceptYoutube &&
          <>
            <label htmlFor="youtube-link">Youtube Link</label>
            <input 
              type="text" 
              name="youtube-link"
              value={youtubeLink}
              onChange={(e: any) => {
                setYoutubeLink(e.target.value);
                if (isYoutube(e.target.value)) setMostRecentModified("youtube");
                else if (selectedImage !== "add.png") setMostRecentModified("image");
                else setMostRecentModified(null);
              }} 
              className={styles.input + " " + isYoutube(youtubeLink) ? styles.valid : styles.invalid}
            />
            <hr />            
          </>
        }
        <button
          className={styles.button + " " + styles.upload}
          onClick={() => {
            switch (mostRecentModified) {
              case "image":
                onAddMedia(selectedImage ?? "/add.png");
                break;
              case "youtube":
                onAddMedia(youtubeLink);
                break;
              default:
                setUploadImage(true);
            }
          }}
        >
          {
            (mostRecentModified === "image") ?
              "Use Image"
            : (mostRecentModified === "youtube") ?
              "Use YouTube Video"
            : 
              "Upload new Image"
          }
        </button>          
        <button 
          className={styles.button + " " + styles.cancel}
          onClick={onCancel}
        >
          Cancel
        </button>          
      </main>      
    </div>    
  )
}

async function sendImageToServer(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/image", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  return response;
}

function isYoutube(url: string): boolean {
  return /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})$/.test(url);
}