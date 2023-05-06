import styles from "./Designer.module.css";
import { AdminLayout } from "@/components/layouts";
import { PopulatedExhibitCreatable, UserData } from "@/types";
import { useState } from "react";
import Card from "./Card";

export default function Designer({ 
  originalExhibit,
  userData
}: { 
  originalExhibit: PopulatedExhibitCreatable,
  userData?: UserData
}) {
  const [cache, setCache] = useState<PopulatedExhibitCreatable>(originalExhibit);

  return (
    <AdminLayout>
      <h1>hey</h1>
      <Card
        card={{
          title: cache.title,
          media: cache.thumbnail,
          description: cache.summary
        }}
      />
      {(cache.cards || []).map((card, index) => 
        <Card
          key={index}
          card={card}
        />
      )}
    </AdminLayout>
  );
}