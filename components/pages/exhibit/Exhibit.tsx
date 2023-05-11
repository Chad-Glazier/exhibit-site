import { TextEditor } from "@/components/general";
import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { useState } from "react";
import ActiveCard from "./ActiveCard";
import CardTile from "./CardTile";
import { Layout } from "@/components/layouts";

export default function Exhibit({
  exhibit
}: {
  exhibit: PopulatedExhibitCreatable;
}) {
  const [activeCard, setActiveCard] = useState(-1);

  return (
    <Layout>
      <h1>{exhibit.title}</h1>
      <TextEditor readonly={true} initialState={exhibit.summary} />
      {exhibit.cards.map((card, index) => {
        if (index === activeCard) {
          return <ActiveCard key={index} card={card} />
        }
        return <CardTile key={index} card={card} onClick={() => setActiveCard(index)} />
      })}
    </Layout>
  )
}