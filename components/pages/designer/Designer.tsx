import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData, PopulatedExhibitCreatable } from "@/types";
import { useState, useRef } from "react";
import Card from "./Card";
import { ImageType } from "@/types";
import { api } from "@/util/client";
import { LoadingOverlay, TextEditor } from "@/components/general";
import Link from "next/link";
import ConfirmExit from "./ConfirmExit";
import Image from "next/image";
import AddMediaPopup from "./AddMediaPopup";

export default function Designer({ 
  originalExhibit,
  userData,
  allExhibits,
  allImages
}: { 
  originalExhibit: PopulatedExhibitCreatable;
  userData: UserData;
  allExhibits: PopulatedExhibitCreatable[];
  allImages: ImageType[];
}) {
  const lastSavedVersion = useRef<string>(JSON.stringify(originalExhibit));
  const cache = useRef<PopulatedExhibitCreatable>({ ...originalExhibit });
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [_, forceUpdate] = useState(false);
  const titleWasChanged = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <AddMediaPopup
        show={showImagePopup}
        imageCache={allImages}
        onClose={() => setShowImagePopup(false)}
        onUrlSubmit={(newUrl) => {
          cache.current.thumbnail = newUrl;
          setShowImagePopup(false);
        }}
      />
      <ConfirmExit
        show={showExitWarning}
        onCancel={() => setShowExitWarning(false)}
      />
      <AdminLayout
        pageName={cache.current.title}
        userData={userData}
      >
        <div className={styles.buttons}>
          <button 
            className={styles.button}
            onClick={async () => {
              if (
                titleWasChanged.current 
                && allExhibits.find(el => el.title === cache.current.title) !== undefined
              ) {
                alert("An exhibit with that title already exists!");
                return;
              }
              setLoading(true);
              if (
                titleWasChanged.current
                && originalExhibit.title !== cache.current.title
              ) {
                await api.exhibit.deleteOne(originalExhibit.title);
                const res = await api.exhibit.post(cache.current);
                if (!res.ok) {
                  alert(res.error);
                }
                lastSavedVersion.current = JSON.stringify(cache.current);
              } else {
                const res = await api.exhibit.put(cache.current);
                if (!res.ok) {
                  alert(res.error);
                }
                lastSavedVersion.current = JSON.stringify(cache.current);
              }

              setLoading(false);
            }}
          >
            Save
          </button>
          <Link
            className={styles.button} 
            href={`/preview/${encodeURIComponent(cache.current.title)}`} 
            target="_blank"
          >
            Preview
          </Link>
          <Link
            onClick={(e) => {
              if (
                JSON.stringify(cache.current) 
                !== 
                lastSavedVersion.current
              ) {
                e.preventDefault();
                setShowExitWarning(true);
              }
            }}
            className={styles.button}
            href="/dashboard"
          >
            Exit
          </Link>
        </div>
        <div className={styles.cards}>
          <div className={styles.mainCard}>
            <input 
              className={styles.title}
              title="Click to change the title"
              type="text" 
              defaultValue={cache.current.title} 
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  cache.current.title = e.target.value;
                  titleWasChanged.current = cache.current.title !== originalExhibit.title;
                }
              }}
            />
            <div className={styles.mainCardInner}>
              <Image
                className={styles.thumbnail}
                src={cache.current.thumbnail}
                width={356}
                height={200}
                alt="thumbnail"
                title="Click to change the thumbnail"
                onClick={() => {
                  setShowImagePopup(true);
                }}
              />
              <TextEditor
                className={styles.summary}
                innerClassName={styles.summaryInner}
                placeholder="Enter a summary..."
                initialState={cache.current.summary}
                onChange={(newSummary) => {
                  cache.current.summary = JSON.stringify(newSummary);
                }}
              />                
            </div>
          </div>
          {cache.current.cards.map((card, index) => {
            // necessary since cards don't have any other intrinsic identifier.
            if ((card as any).id === undefined) {
              (card as any).id = `${card.media} ${Math.random()}`;
            }
            
            return <Card
              key={(card as any).id}
              onChange={(updatedCard) => {
                cache.current.cards[index] = updatedCard;
                forceUpdate(x => !x);
              }}
              allImages={allImages}
              card={card}
              onDelete={() => {
                cache.current.cards = cache.current.cards.filter((_, i) => i !== index);
                forceUpdate(x => !x);
              }}
              acceptYouTube
            />;
          })}
          <button
            className={styles.addCardButton}
            onClick={() => {
              // the description field is a JSON string that represents an empty document,
              // which is necessary for the Lexical text editor to parse (it throws a 
              // fit otherwise)
              cache.current.cards.push({
                media: "/no-image.png",
                description: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
              });
              forceUpdate(x => !x);
            }}
          >
            Add Card
          </button>
        </div>
      </AdminLayout>    
    </>

  );
}