import styles from "./AddMediaPopup.module.css";
import { Popup } from "@/components/general";
import { youTubePattern, isYouTube, getBasename } from "@/util";
import { useState } from "react";
import { api } from "@/util/client";
import { useRouter } from "next/router";
import { Image } from "@prisma/client";
import { LoadingOverlay } from "@/components/general";

enum MediaType {
  ExistingImage,
  NewImage,
  YouTube
}

/**
 * This is a popup that allows users to upload media in on of three forms:
 * -  An existing image on the server
 *    - this is why the `imageCache` prop is needed.
 * -  A new image
 *    - this popup allows users to upload images to the server.
 * -  A YouTube video
 *    - this popup allows users to include a YouTube link.
 * 
 * In all of these cases, the `onUrlSubmit` prop is called with a URL to
 * the media.
 */
export default function AddMediaPopup({
  show,
  imageCache,
  onClickAway,
  onUrlSubmit
}: {
  show?: boolean;
  imageCache: Image[];
  onClickAway?: () => void;
  onUrlSubmit: (newUrl: string) => void;
}) {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.NewImage);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>   
      <LoadingOverlay show={loading} />
      <Popup
        show={show && !loading}
        onClickAway={onClickAway}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (loading) return;

          switch (mediaType) {
            case MediaType.ExistingImage:
              const url = (document.getElementById("existing-image") as HTMLSelectElement).value;
              onUrlSubmit(url);
              break;
            case MediaType.NewImage:
              const image = (document.getElementById("image-upload") as HTMLInputElement).files?.[0];
              if (!image) return;
              setLoading(true);
              const res = await api.image.post(image);
              if (!res.ok) {
                router.push("/500_Admin");
                return;
              }
              imageCache.push(res.body);
              onUrlSubmit(res.body.url);  
              setLoading(false);
              break;
            case MediaType.YouTube:
              const youTubeLink = (document.getElementById("youtube-link") as HTMLInputElement).value;
              onUrlSubmit(youTubeLink);
              break;
          }    
        }}>
          <h1>Add Media</h1>
          <label htmlFor="image-upload">Upload an Image</label>
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={() => setMediaType(MediaType.NewImage)} 
            required={mediaType === MediaType.NewImage} 
          />
          <br />
          <em>OR</em>
          <br />
          <label htmlFor="existing-image">Select an Existing Image</label>
          <select id="existing-image">
            <option value={""} onClick={() => {
              if (
                isYouTube((document.getElementById("youtube-link") as HTMLInputElement).value) 
                && !(document.getElementById("image-upload") as HTMLInputElement).files
              ) {
                setMediaType(MediaType.YouTube);
              } else {
                setMediaType(MediaType.NewImage);
              }
            }}>
              Select an Image
            </option>
            {imageCache.map((image, index) => {
              let basename = decodeURIComponent(getBasename(image.url));
              return (
                <option key={index} value={image.url} onClick={() => setMediaType(MediaType.ExistingImage)}>
                  {basename}
                </option>
              )
            })}
          </select>
          <br />
          <em>OR</em>
          <br />
          <label htmlFor="youtube-link">Enter a YouTube URL:</label>
          <input 
            type="text" 
            id="youtube-link" 
            placeholder="https://youtu.be/cV0_DFkJU_w" 
            accept={youTubePattern} 
            onChange={(e) => {
              if (isYouTube(e.target.value)) {
                setMediaType(MediaType.YouTube);
                return;
              }
              if (
                (document.getElementById("existing-image") as HTMLSelectElement).value
                && !(document.getElementById("image-upload") as HTMLInputElement).files
              ) {
                setMediaType(MediaType.ExistingImage);
                return;
              }
              setMediaType(MediaType.NewImage);
            }} 
          />
          <br />
          <input type="submit" value={
            mediaType === MediaType.ExistingImage ? "Select Image" : 
            mediaType === MediaType.NewImage ? "Upload Image" :
            "Submit URL"
          } />
        </form>
      </Popup>
    </>
  );
}