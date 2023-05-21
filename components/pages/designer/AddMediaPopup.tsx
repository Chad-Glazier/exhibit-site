import styles from "./AddMediaPopup.module.css";
import { Popup } from "@/components/general";
import { useState } from "react";
import { Image } from "@prisma/client";
import { AddImage, AddYouTube } from "@/components/general";
import { getBasename } from "@/util";

export default function AddMediaPopup({
  show,
  imageCache,
  onClose,
  onUrlSubmit,
  acceptYouTube
}: {
  show: boolean;
  imageCache: Image[];
  onClose: () => void;
  onUrlSubmit: (newUrl: string) => void;
  acceptYouTube?: boolean;
}) {
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false);
  const [showAddYouTube, setShowAddYouTube] = useState<boolean>(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  return (
    <>   
      <AddImage
        show={showUploadImage}
        onUpload={(newImageUrl) => {
          onUrlSubmit(newImageUrl);
          setShowUploadImage(false);
        }}
        onCancel={() => {
          setShowUploadImage(false);
        }}
      />
      {acceptYouTube &&
        <AddYouTube
          show={showAddYouTube}
          onSubmit={(youtubeUrl) => {
            onUrlSubmit(youtubeUrl);
            setShowAddYouTube(false);
          }}
          onCancel={() => {
            setShowAddYouTube(false);
          }}
        />        
      }
      <Popup
        show={show}
        onClickAway={() => {
          onClose();
          setExistingImage(null);
        }}
      >
        <form 
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h2 className={styles.title}>Add Media</h2>
          <p>Select the type of media to add.</p>
          <button 
            className={styles.button}
            onClick={() => {
              onClose();
              setShowUploadImage(true);
            }}
          >
            Upload a New Image
          </button>
          {acceptYouTube &&
            <button
              className={styles.button} 
              onClick={() => {
                onClose();
                setShowAddYouTube(true);
              }}
            >
              Add a YouTube Video
            </button>          
          }
          <em className={styles.divider}>or</em>
          <select 
            className={styles.select}
            name="select-image" 
            id="select-image"
            onChange={(e) => {
              if (e.target.value === "") {
                setExistingImage(null);
              } else {
                setExistingImage(e.target.value);
              }
            }}
          >
            <option 
              className={styles.option}
              value={""}
            >
              Select an Existing Image
            </option>
            {imageCache.map(({ url }, index) => (
              <option 
                key={index}
                className={styles.option} 
                value={url}
              >
                {decodeURIComponent(getBasename(url))}
              </option>  
            ))}
          </select>
          {existingImage && 
            <button className={styles.button} onClick={() => {
              onClose();
              onUrlSubmit(existingImage);
              setExistingImage(null);
            }}>
              Use Selected Image
            </button> 
          }
        </form>
      </Popup>
    </>
  );
}