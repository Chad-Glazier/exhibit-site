import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { PopulatedExhibitCreatable, UserData } from "@/types";
import { useState, useRef } from "react";
import Card from "./Card";
import { Image } from "@prisma/client";
import { api } from "@/util/client";
import { useRouter } from "next/router";

export default function Designer({ 
  originalExhibit,
  userData,
  allExhibits,
  allImages
}: { 
  originalExhibit: PopulatedExhibitCreatable;
  userData: UserData;
  allExhibits: PopulatedExhibitCreatable[];
  allImages: Image[];
}) {
  const cache = useRef<PopulatedExhibitCreatable>({ ...originalExhibit });
  const router = useRouter();
  const [_, forceUpdate] = useState(false);
  const titleWasChanged = useRef(false);

  return (
    <AdminLayout>
      <button onClick={async () => {
        if (
          titleWasChanged.current 
          && allExhibits.find(el => el.title === cache.current.title) !== undefined
        ) {
          alert("An exhibit with that title already exists!");
          return;
        }

        const res = await api.exhibit.put(cache.current);
        if (!res.ok) {
          router.push("/500_Admin");
        }
      }}>
        Save
      </button>
      <input type="text" defaultValue={cache.current.title} onChange={(e) => {
        if (e.target.value.length > 0) {
          cache.current.title = e.target.value;
          titleWasChanged.current = cache.current.title !== originalExhibit.title;
        }
      }}/>
      <Card
        allImages={allImages}
        card={{
          media: cache.current.thumbnail,
          description: cache.current.summary
        }}
        onChange={({ media, description }) => {
          cache.current.thumbnail = media; 
          cache.current.summary = description;
        }}
      />
      {cache.current.cards.map((card, index) => 
        <Card
          onChange={(updatedCard) => {
            cache.current.cards[index] = updatedCard;
          }}
          allImages={allImages}
          key={index}
          card={card}
        />
      )}
      <button
        onClick={() => {
          cache.current.cards.push({
            media: "/add.png",
            description: ""
          });
          forceUpdate(x => !x);
        }}
      >
        Add Card
      </button>
    </AdminLayout>
  );
}