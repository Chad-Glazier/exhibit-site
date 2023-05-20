import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { PopulatedExhibitCreatable, UserData } from "@/types";
import { useState, useRef } from "react";
import Card from "./Card";
import { Image } from "@prisma/client";
import { api } from "@/util/client";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@/components/general";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <AdminLayout
        pageName={cache.current.title}
        userData={userData}
      >
        <button onClick={async () => {
          if (
            titleWasChanged.current 
            && allExhibits.find(el => el.title === cache.current.title) !== undefined
          ) {
            alert("An exhibit with that title already exists!");
            return;
          }
          setLoading(true);
          const res = await api.exhibit.put(cache.current);
          if (!res.ok) {
            router.push("/500_Admin");
          }
          setLoading(false);
        }}>
          Save
        </button>
        <Link href={`/preview/${encodeURIComponent(cache.current.title)}`} target="_blank">
          Preview
        </Link>
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
            forceUpdate(x => !x);
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
            onDelete={() => {
              cache.current.cards = cache.current.cards.filter((_, i) => i !== index);
              forceUpdate(x => !x);
            }}
          />
        )}
        <button
          onClick={() => {
            // the description field is a JSON string that represents an empty document,
            // which is necessary for the Lexical text editor to parse (it throws a 
            // fit otherwise)
            cache.current.cards.push({
              media: "/add.png",
              description: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
            });
            forceUpdate(x => !x);
          }}
        >
          Add Card
        </button>
      </AdminLayout>    
    </>

  );
}