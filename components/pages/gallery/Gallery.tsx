import styles from "./Gallery.module.css";
import { AdminLayout } from "@/components/layouts";
import { Image } from "@prisma/client";
import GalleryTile from "./GalleryTile";
import { UserData } from "@/types";
import React, { useState } from "react";
import { api } from "@/util/client";
import { LoadingOverlay, AddImage } from "@/components/general";

export default function Gallery({
  images,
  imageTitles,
  userData
}: {
  images: Image[];
  imageTitles: Record<string, string[]>;
  userData: UserData;
}) {
  const [imageCache, setImageCache] = useState(images);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <AddImage
        show={showPopup && !loading}
        onUpload={(newImageUrl) => {
          setImageCache(prev => [...prev, { url: newImageUrl }]);
          setShowPopup(false);
        }}
        onCancel={() => setShowPopup(false)}
      />
      <AdminLayout
        pageName="Gallery"
        userData={userData}
      >
        <h1 className={styles.heading}>Gallery</h1>
        <section className={styles.images}>
          {imageCache.map((el, index) =>
            <GalleryTile
              key={index}
              image={el}
              dependantExhibits={imageTitles[el.url] || []}
              onDelete={async () => {
                setLoading(true);
                const res = await api.image.deleteOne(el.url);
                if (!res.ok) {
                  alert(res.error);
                  setLoading(false);
                } else {
                  setImageCache(prev => prev.filter(({ url }) => url !== el.url))         
                  setLoading(false);
                }
              }}
            />
          )}    
          <button 
            onClick={() => setShowPopup(true)}
            className={styles.button}
          >
            Add Image
          </button>  
        </section>  
      </AdminLayout>    
    </>
  );
}