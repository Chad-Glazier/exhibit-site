import { TextEditor } from "@/components/general";
import styles from "./Exhibit.module.css";
import { CardCreatable, PopulatedExhibitCreatable } from "@/types";
import { useState } from "react";
import ActiveCard from "./ActiveCard";
import CardTile from "./CardTile";
import { Layout } from "@/components/layouts";

export default function Exhibit({
  exhibit
}: {
  exhibit: PopulatedExhibitCreatable;
}) {
  const [activeCard, setActiveCard] = useState<CardCreatable | null>(null);

  return (
    <Layout pageName={exhibit.title}>
      <h1>{exhibit.title}</h1>
      <TextEditor readonly={true} initialState={exhibit.summary} />
      {activeCard && 
        <ActiveCard card={activeCard} />
      }
      {exhibit.cards.map((card, index) => {
        if (card === activeCard) {
          return <></>;
        }
        return <CardTile key={index} card={card} onClick={() => setActiveCard(card)} />
      })}
    </Layout>
  )
}