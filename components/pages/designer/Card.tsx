import styles from "./Card.module.css";
import { CardCreatable } from "@/types";
import { useState } from "react";
import AddMediaPopup from "./AddMediaPopup";
import Image from "next/image";
import dynamic from "next/dynamic";
import { TextEditor } from "@/components/general";

export default function Card({
  card,
  onChange
}: {
  card: CardCreatable,
  onChange?: (updatedCard: CardCreatable) => void
}) {
  const [updatedCard, setUpdatedCard] = useState<CardCreatable>(card);
  const [showMediaPopup, setShowMediaPopup] = useState<boolean>(false);
  
  return (
    <>
      <AddMediaPopup
        show={showMediaPopup}
        onClickAway={() => setShowMediaPopup(false)}
      />
      <form className={styles.card}>
        <Image
          onClick={() => setShowMediaPopup(true)}
          src={updatedCard.media}
          alt={updatedCard.title}
          width={200}
          height={200}
        />
        <TextEditor />
      </form>    
    </>
  );
}