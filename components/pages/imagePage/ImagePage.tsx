import styles from "./ImagePage.module.css";
import Image from "next/image";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";
import { api } from "@/util/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Popup, LoadingOverlay } from "@/components/general";

export default function ImagePage({
  imageName,
  imageUrl,
  userData,
  relevantExhibitTitles
}: {
  imageUrl: string;
  imageName: string;
  userData: UserData;
  relevantExhibitTitles: string[];
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/gallery")
  });

  return (
    <> 
      <LoadingOverlay show={loading} />
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <div className={styles.popup}>
          <h2 className={styles.popupTitle}>
            Delete Image
          </h2>
          <p>
            Are you sure you want to delete &quot;{imageName}&quot;&#x3F;
          </p>
          <div className={styles.popupButtons}>
            <button 
              className={styles.button}
              onClick={async () => {
                setLoading(true);
                setShowPopup(false);
                const res = await api.image.deleteOne(imageUrl);
                if (!res.ok) {
                  alert(res.error);
                  setLoading(false);
                } else {
                  router.push("/gallery");
                }
              }}
            >
              Delete
            </button>
            <button
              className={styles.button} 
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>        
          </div>
        </div>
      </Popup>
      <AdminLayout 
        userData={userData}
        pageName={imageName}
      >
      <main className={styles.imagePage}>
        <Image
          className={styles.image}
          alt={imageName}
          src={imageUrl}
          width={500}
          height={500}
          sizes="100vw"
        />
        <div className={styles.imageDescription}>
          <h1>{imageName}</h1>
          {relevantExhibitTitles.length === 0 ?
            <>
              <p>This image is not being used by any exhibits</p>
              <button
                onClick={() => setShowPopup(true)} 
                className={styles.button}
              >
                Delete Image
              </button>
            </>
            :
            <>
              <p>This image is being used by the following exhibits:</p>
              <ul>
              {relevantExhibitTitles.map((title, index) => 
                <li key={index}>{title}</li>
              )}
              </ul>            
            </>
          }
        </div>
      </main>    
      </AdminLayout>
    </>
  );
}