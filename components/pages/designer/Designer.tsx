import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData, PopulatedExhibit, CardType } from "@/types";
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
  originalExhibit: PopulatedExhibit;
  userData: UserData;
  allExhibits: PopulatedExhibit[];
  allImages: ImageType[];
}) {
  const lastSavedVersion = useRef<string>(JSON.stringify(originalExhibit));
  const cache = useRef<PopulatedExhibit>({ ...originalExhibit });
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [_, forceUpdate] = useState(false);
  const titleWasChanged = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const redirectTarget = useRef<string>("/dashboard");

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
          forceUpdate(x => !x);
        }}
      />
      <ConfirmExit
        target={redirectTarget.current}
        show={showExitWarning}
        onCancel={() => setShowExitWarning(false)}
      />
      <AdminLayout
        pageName={cache.current.title}
        userData={userData}
        onRedirect={(target) => {
          if (
            JSON.stringify(cache.current) 
            !== 
            lastSavedVersion.current
          ) {
            redirectTarget.current = target;
            setShowExitWarning(true);
            return false;
          }
          return true;
        }}
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
                // cannot use "PUT" because the original exhibit won't be identified
                // by the new title, meaning that it will persist.
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
                  return;
                }
                cache.current = res.body;
                lastSavedVersion.current = JSON.stringify(cache.current);
              }
              setLoading(false);
            }}
            title="Save the exhibit"
          >
            Save
          </button>
          <Link
            className={styles.button} 
            href={`/preview/${encodeURIComponent(cache.current.title)}`} 
            target="_blank"
            title="Preview the last saved version in a new tab"
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
                redirectTarget.current = "/dashboard";
                setShowExitWarning(true);
              }
            }}
            className={styles.button}
            href="/dashboard"
            title="Return to the dashboard"
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
            return <Card
              key={card.id}
              id={`card ${card.id}`}
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
              onMoveUp={index !== 0 ? 
                () => {
                  if (index === 0) return;
                  const temp = cache.current.cards[index - 1];
                  cache.current.cards[index - 1] = card;
                  cache.current.cards[index] = temp;
                  forceUpdate(x => !x);
                } 
                : 
                undefined
              }
              onMoveDown={index !== cache.current.cards.length - 1 ? 
                () => {
                  if (index === cache.current.cards.length - 1) return;
                  const temp = cache.current.cards[index + 1];
                  cache.current.cards[index + 1] = card;
                  cache.current.cards[index] = temp;
                  forceUpdate(x => !x);
                }
                : 
                undefined
              }
              acceptYouTube
            />;
          })}
          <button
            className={styles.addCardButton}
            onClick={() => {
              cache.current.cards.push({
                exhibitId: cache.current.id,
                id: Math.random(), // this will get ignored by the server when you ship 
                                   // the updated version, so it's okay to do this.
                media: "/no-image.png",
                description: TextEditor.emptyEditorState(),
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