import { AdminLayout } from "@/components/layouts";
import { Image } from "@prisma/client";
import GalleryTile from "./GalleryTile";
import { UserData } from "@/types";
import React, { useState } from "react";
import { api } from "@/util/client";
import { Popup } from "@/components/general";

export default function Gallery({
  images,
  userData
}: {
  images: Image[],
  userData: UserData
}) {
  const [imageCache, setImageCache] = useState(images);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <AdminLayout>
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <form
          onSubmit={e => {
            e.preventDefault();

            const imageInputElement = document.getElementById("image") as HTMLInputElement;
            const imageFiles = imageInputElement.files;
            if (!imageFiles || imageFiles.length === 0) {
              return;
            }

            const imageFile = imageFiles[0];
            api.image.post(imageFile)
              .then(res => {
                if (res.ok) {
                  setImageCache(prev => [...prev, res.body]);
                  return;
                }
                //todo handle error
              });
            setShowPopup(false);
          }}
        >
          <label htmlFor="image">Add Image</label>
          <input type="file" id="image" name="image" accept="image/" />
          <button type="submit">Upload</button>
        </form>
      </Popup>
      <h1>Gallery</h1>
      {imageCache.map((el, index) =>
        <GalleryTile
          key={index}
          image={el}
          onDelete={() => {
            api.image.deleteOne(el.url);
            setImageCache(prev => prev.filter(({ url }) => url !== el.url))         
          }}
        />
      )}
      <button onClick={() => setShowPopup(true)}>
        Add Image
      </button>
    </AdminLayout>
  );
}