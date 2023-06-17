import styles from "./Gallery.module.css";
import { AdminLayout } from "@/components/layouts";
import GalleryTile from "./GalleryTile";
import { UserData, ImageType } from "@/types";
import React, { useState } from "react";
import { api } from "@/util/client";
import { LoadingOverlay, AddImage } from "@/components/general";
import Image from "next/image";

export default function Gallery({
  images,
  imageTitles,
  userData,
  targetImage
}: {
  images: ImageType[];
  imageTitles: Record<string, string[]>;
  userData: UserData;
  targetImage?: string;
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
        className={styles.page}
      >
        <h1 className={styles.heading}>Gallery</h1>
        <section className={styles.images}>
          {imageCache.map((el, index) =>
            <GalleryTile
              openDetails={targetImage === el.url}
              key={el.url}
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
          <Image 
            src="/plus.svg"
            alt="Add Exhibit"
            width={100}
            height={120}
            className={styles.button} 
            onClick={() => setShowPopup(true)}
          />
        </section>  
      </AdminLayout>    
    </>
  );
}