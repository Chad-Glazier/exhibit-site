import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData, PopulatedExhibit, CardType, ImageType } from "@/types";
import { useState, useRef, useCallback } from "react";
import { Alert, LoadingOverlay } from "@/components/general";
import { deepClone } from "@/util";
import Cards from "./Cards";
import Thumbnail from "./Thumbnail";
import { api } from "@/util/client";
import Link from "next/link";
import Image from "next/image";

export default function Designer({ 
  originalExhibit,
  userData,
  otherExhibitTitles,
  allImages
}: { 
  originalExhibit: PopulatedExhibit;
  userData: UserData;
  otherExhibitTitles: string[];
  allImages: ImageType[];
}) {
  const [loading, setLoading] = useState(false);
  const [exhibit, setExhibit] = useState(deepClone(originalExhibit));
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState(allImages);
  const thumbnailRef = useRef<{ 
    title: string, 
    thumbnail: string, 
    summary: string 
  }>({
    title: originalExhibit.title,
    thumbnail: originalExhibit.thumbnail,
    summary: originalExhibit.summary
  });
  const cardsRef = useRef<CardType[]>(originalExhibit.cards);
  const lastSavedVersion = useRef<PopulatedExhibit>(originalExhibit);

  const addNewImage = useCallback((newImage: ImageType) => {
    setImageCache(prev => [...prev, newImage]);
  }, []);

  async function saveExhibit() {
    if (thumbnailRef.current?.title === "") {
      setAlertMessage("The title cannot be empty.");
      return;
    }

    if (otherExhibitTitles.some(title => title === thumbnailRef.current?.title)) {
      setAlertMessage("That title is already in use by another exhibit. Please change the title before saving");
      return;
    }

    setLoading(true);
    const res = await api.exhibit.updateOne(
      lastSavedVersion.current.title,
      {
        title: thumbnailRef.current.title,
        summary: thumbnailRef.current.summary,
        thumbnail: thumbnailRef.current.thumbnail,
        cards: cardsRef.current,
        priority: exhibit.priority,
        published: exhibit.published,
      });
    setLoading(false);

    if (res.error) {
      setAlertMessage(res.error);
      return;
    }

    if (res.body) {
      setExhibit(res.body);
      lastSavedVersion.current = res.body;
    }
  }

  return (
    <>
      <LoadingOverlay show={loading} />
      <Alert
        message={alertMessage}
        setMessage={setAlertMessage}
      />
      <AdminLayout
        pageName={exhibit.title}
        userData={userData}
        className={styles.page}
      >
        <div
          className={styles.controls}
        >
          <button 
            onClick={saveExhibit}
            className={styles.button}
          >
            Save
            <Image
              className={styles.icon}
              src="/save.svg"
              width={20}
              height={20}
              alt=""
            />
          </button>
          <Link 
            target="_blank"
            href={`/preview/${encodeURIComponent(exhibit.title)}`}
            className={styles.button}
          >
            Preview
            <Image
              className={styles.icon}
              src="/open.svg"
              width={16}
              height={16}
              alt=""
            />
          </Link>
        </div>
        <Thumbnail
          ref={thumbnailRef}
          title={exhibit.title}
          thumbnail={exhibit.thumbnail}
          summary={exhibit.summary}
          onNewImage={addNewImage}
          existingImages={imageCache}
        />
        <Cards
          onNewImage={addNewImage}
          cards={exhibit.cards}
          ref={cardsRef}
          existingImages={imageCache}
        />
      </AdminLayout>    
    </>
  );
}