import styles from "./Cards.module.css";
import { CardType, ImageType } from "@/types";
import { TextEditor, Media, Popup } from "@/components/general";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import AddMedia from "./popups/AddMedia";
import { isYouTube } from "@/util";
import DeleteCard from "./popups/DeleteCard";

const Cards = forwardRef(function Cards({
  cards,
  existingImages,
  onNewImage,
}: {
  cards: CardType[];
  existingImages: ImageType[];
  onNewImage: ({ url }: { url: string }) => void;
},
  ref: React.Ref<CardType[]>
) {
  const cache = useRef(cards);
  const [active, setActive] = useState(-1);
  const [showMediaSelect, setShowMediaSelect] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(-1);

  useImperativeHandle(ref, () => cache.current);

  useEffect(() => {
    cache.current = cards;
  }, [cards]);

  return (
    <>
      <DeleteCard
        onClose={() => setDeleteTarget(-1)}
        show={deleteTarget !== -1}
        onDelete={() => {
          cache.current.splice(deleteTarget, 1);
          setDeleteTarget(-1);
        }}
      />
      <AddMedia
        show={showMediaSelect}
        close={() => {
          setShowMediaSelect(false);
        }}
        existingImages={existingImages}
        onAdd={newUrl => {
          if (
            !isYouTube(newUrl)
            &&
            existingImages.find(image => image.url === newUrl) === undefined
          ) {
            onNewImage({ url: newUrl });
          }
          cache.current[active].media = newUrl;
          setShowMediaSelect(false);
        }}
      />
      <Popup show={active !== -1 && !showMediaSelect} onClickAway={() => setActive(-1)}>
        <section
          className={styles.open}
        >
          <Image
            className={styles.arrowButton}
            src="/arrow.svg"
            height={120}
            width={60}
            alt="<"
            onClick={() => setActive(prev => prev ? prev - 1 : cache.current.length - 1)}
          />
          <Image
            className={styles.arrowButton}
            src="/arrow.svg"
            height={120}
            width={60}
            alt=">"
            onClick={() => setActive(prev => (prev + 1) % cache.current.length)}
          />
          <Image
            className={styles.exitButton}
            src="/plus.svg"
            height={40}
            width={40}
            alt="X"
            onClick={() => setActive(-1)}
          />
          <div
            className={styles.mediaContainer}
            style={{ width: isYouTube(cache.current[active]?.media) ? "100%" : "auto" }}
            onClick={() => {
              setShowMediaSelect(true)
            }}
          >
            <Media
              url={cache.current[active]?.media}
              active={true}
              className={styles.media}
            />
            <Image 
              src="/edit.svg"
              height={32}
              width={32}
              alt="Edit"
              className={styles.editButton}
            />
          </div>
          <TextEditor
            key={cache.current[active]?.id}
            className={styles.text}
            innerClassName={styles.textInner}
            initialState={cache.current[active]?.description}
            onChange={state => cache.current[active].description = JSON.stringify(state)}
          />
        </section>
      </Popup>
      <section
        className={styles.container}
      >
        <div
          className={styles.tiles}
        >
          {
            cache.current.map((card, i) => 
              <div 
                className={styles.tile + (active === i ? ` ${styles.active}` : "")} 
                key={card.id}
                onClick={() => {
                  setActive(i);
                }}
              >
                <Media
                  url={card.media}
                  active={false}
                />
                <Image 
                  src="/edit.svg"
                  height={32}
                  width={32}
                  alt="Edit"
                  className={styles.editButton}
                />
                <div
                  className={styles.slideMenu}
                >
                  <button
                    className={styles.button}   
                    data-type="edit"                 
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={e => {
                      e.stopPropagation();
                      setDeleteTarget(i);
                    }}
                    data-type="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          }
          <Image
            height={100}
            width={100}
            src="/plus.svg"
            alt="Add a new card"
            className={styles.addCardButton}
            onClick={() => {
              cache.current.push({
                id: Math.random(),
                exhibitId: -1,
                media: "/no-image.png",
                description: TextEditor.emptyEditorState()
              });
              setActive(cache.current.length - 1);
            }}
          />
        </div>
      </section>    
    </>
  )
});

export default Cards;