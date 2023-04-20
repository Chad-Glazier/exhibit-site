import React, { useState, useEffect } from "react";
import { CardCreatable, ErrorMessage, PopulatedExhibit, PopulatedExhibitCreatable, PopulatedExhibitCreatableSchema } from "@/types";
import { WithAuthProps } from "@/components/hoc";
import styles from "@/styles/Designer.module.css";
import { AdminNav, ErrorPopup, ConfirmPopup } from "@/components";
import { NotFound } from "@/components/pages"
import { Card } from "@prisma/client";
import ExhibitPage from "@/pages/exhibit/[title]";
import { useRouter } from "next/router";
import AddMediaPopup from "../AddMediaPopup";
import { Image } from "@prisma/client";
import { useDidMountEffect } from "@/components/hooks";

export interface DesignerProps extends WithAuthProps {
  exhibit: PopulatedExhibit | null;
  imageCache: Image[];
}

export default function Designer({
  exhibit,
  imageCache
}: DesignerProps) {
  if (exhibit === null) return <NotFound />;
  const [currentExhibit, setCurrentExhibit] = 
    useState<PopulatedExhibitCreatable>(
      PopulatedExhibitCreatableSchema.parse(exhibit) as PopulatedExhibitCreatable);
  const [title, setTitle] = useState(currentExhibit.title);
  const [summary, setSummary] = useState(currentExhibit.summary);
  const [cards, setCards] = useState(currentExhibit.cards);
  const [thumbnail, setThumbnail] = useState(currentExhibit.thumbnail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showAddMedia, setShowAddMedia] = useState<boolean>(false);
  const [addMediaTarget, setAddMediaTarget] = useState<number>(-1);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [deletionIndex, setDeletionIndex] = useState<number>(-1);
  const [mediaCache, setMediaCache] = useState<string[]>(
    imageCache.map(({ url }: Image) => url)
  );
  const router = useRouter();

  async function saveExhibit() {
    const newExhibit: PopulatedExhibitCreatable = {
      title,
      summary,
      thumbnail,
      cards: cards,
      published: currentExhibit.published
    };

    const response = await fetch("/api/exhibit", {
      method: exhibit?.title === title ? "PUT" : "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExhibit)
    });

    if (response.ok) {
      if (exhibit?.title !== title) {
        await fetch("/api/exhibit?title=" + exhibit?.title, {
          method: "DELETE",
          credentials: "same-origin"
        })
      }
      return;
    }
    
    setErrorMessage(((await response.json()) as ErrorMessage).message);
  }

  function handleCardChange(index: number, key: keyof Card, value: string) {
    const updatedCards = cards.map((card, i) =>
      i === index ? { ...card, [key]: value } : card
    );
    setCards(updatedCards);
  };

  useEffect(() => {
    window.addEventListener("popstate", () => {
      if (showPreview) {
        setShowPreview(false);
      }
    })
  }, []);

  useDidMountEffect(() => {
    if (showPreview) {
      router.push(`${router.asPath}`, undefined, { shallow: true });
    } else {
      router.replace(router.asPath, undefined, { shallow: true });
    }
  }, [showPreview]);

  if (showPreview) {
    const newExhibit: PopulatedExhibit = {
      id: -1,
      title,
      summary,
      thumbnail,
      cards: cards.map((card: CardCreatable) => {
        return {
          ...card,
          id: -1,
          exhibitId: -1
        }
      }),
      published: currentExhibit.published
    }

    return (
      <div>
        <div className={styles.button + " " + styles.returnButton} onClick={() => setShowPreview(false)}>Currently Viewing Preview. Click Here to Return</div>
        <ExhibitPage exhibit={newExhibit} />
      </div>
    )
  }

  return (
    <main className={styles.main}>
      {errorMessage && 
        <ErrorPopup 
          message={errorMessage} 
          onOkay={() => setErrorMessage(null)} 
        />
      }
      {showAddMedia &&
        <AddMediaPopup
          mediaCache={mediaCache}
          acceptYoutube={addMediaTarget >= 0}
          onCancel={() => {
            setShowAddMedia(false);
          }}
          onAddMedia={(mediaUrl: string) => {
            if (addMediaTarget >= 0) {
              setCards(prev => prev.map((card, index) => {
                if (index === addMediaTarget) {
                  return {...card, media: mediaUrl};
                }
                return card;
              }));              
            } else {
              setThumbnail(mediaUrl);
            }
            setShowAddMedia(false);
            if (!mediaCache.includes(mediaUrl)) {
              setMediaCache([...mediaCache, mediaUrl]);
            }
          }}
        />
      }
      {showConfirmDelete &&
        <ConfirmPopup 
          message={`Are you sure you want to delete the "${cards[deletionIndex].title}" card?`} 
          onConfirm={() => {
            setCards(prev => prev.filter((_, id) => id != deletionIndex));
            setShowConfirmDelete(false);
          }} 
          onCancel={() => {
            setShowConfirmDelete(false);
          }}          
        />
      }
      <AdminNav />
      <div className={styles.button} onClick={saveExhibit}>Save</div>
      <div className={styles.button} onClick={() => setShowPreview(true)}>Preview</div>
      <div className={styles.exhibit}>
        <img 
          className={styles.media} src={thumbnail} alt="Image not found" 
          onClick={() => {
            setAddMediaTarget(-1);
            setShowAddMedia(true);
          }}
        />
        <div className={styles.text}>
          <input
            className={styles.title}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.summary}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </div>
      {cards.map(({ media, title, description }: CardCreatable, index) => (
          <div key={index} className={styles.card}>
            <img 
              className={styles.deleteButton} alt="+" src="/add.png" 
              onClick={() => {
                setDeletionIndex(index);
                setShowConfirmDelete(true);
              }}  
            />
            {isYoutube(media) ?
              <div
                onClick={() => {
                  setAddMediaTarget(index);
                  setShowAddMedia(true);
                }}
              >
                <iframe 
                  src={media}
                  width={200}
                  height={200}
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen 
                />                
              </div>

              :
              <img 
                className={styles.media} alt="Image not found" src={media || `/add.png`}
                onClick={() => {
                  setAddMediaTarget(index);
                  setShowAddMedia(true);
                }}
              />
            }

            <div className={styles.text}>
              <input
                className={styles.title}
                type="text"
                value={title || ""}
                onChange={(e) => 
                  handleCardChange(index, "title", e.target.value)
                }
              />
              <textarea
                className={styles.description}
                value={description}
                onChange={(e) => handleCardChange(index, "description", e.target.value)}
              />
            </div>
          </div>
      ))}
      <div className={styles.button} onClick={() => setCards([...cards, {
        title: "New Title",
        description: "New description.",
        media: ""
      }])}>Add Card</div>
    </main>
  );
}

function isYoutube(url: string): boolean {
  return /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})$/.test(url);
}