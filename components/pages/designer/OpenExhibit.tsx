import { PopulatedExhibit } from "@/types";
import styles from "./OpenExhibit.module.css";
import { AdminLayout } from "@/components/layouts";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/util/client";

export default function OpenExhibit({
  exhibitCache
}: {
  exhibitCache: PopulatedExhibit[]
}) {
  const router = useRouter();
  const [createNew, setCreateNew] = useState<boolean>(true);
  const [waiting, setWaiting] = useState<boolean>(false);

  return (
    <AdminLayout>
      <form onSubmit={e => {
        e.preventDefault();
        if (waiting) return;
        setWaiting(true);

        const title = createNew ? 
          (document.getElementById("title") as HTMLInputElement).value  
          : (document.getElementById("title-selector") as HTMLInputElement).value;

        if (createNew) {
          // the summary field is a JSON string that represents an empty document,
          // which is necessary for the Lexical text editor to parse (it throws a 
          // fit otherwise)
          api.exhibit.post({
            title,
            summary: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
            thumbnail: "/add.png",
            cards: [],
            published: false
          }).then(res => {
            if (res.body) router.push(`/designer/${encodeURIComponent(res.body.title)}`);
            else router.push("/500_Admin");
          });
          return;
        }
        router.push(`/designer/${title}`);
      }}>
        <label htmlFor="title">Select an Exhibit to Open</label>
        <select name="title" id="title-selector" required>
          <option 
            value="Create New Exhibit"
            onClick={() => setCreateNew(true)}
          >Create New Exhibit</option>
          {exhibitCache && exhibitCache.map((exhibit, index) => (
            <option
              onClick={() => setCreateNew(false)} 
              key={index} 
              value={exhibit.title}
            >{exhibit.title}</option>
          ))}
        </select>
        {createNew && (
          <>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" required />
          </> 
        )}
        <button>{(createNew ? "Create" : "Open") + " Exhibit"}</button>
      </form>
    </AdminLayout>
  );
}