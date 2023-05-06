import { PopulatedExhibit } from "@/types";
import styles from "./OpenExhibit.module.css";
import { AdminLayout } from "@/components/layouts";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/util/client";

export default function OpenExhibit({
  exhibitCache
}: {
  exhibitCache?: PopulatedExhibit[]
}) {
  const router = useRouter();
  const [createNew, setCreateNew] = useState<boolean>(!exhibitCache || exhibitCache.length == 0);

  return (
    <AdminLayout>
      <form onSubmit={e => {
        e.preventDefault();
        if (createNew) {
          api.exhibit.post({
            title: (document.getElementById("title") as HTMLInputElement).value,
            summary: "No description",
            thumbnail: "/add.png",
            cards: [],
            published: false
          }).then(res => {
            if (res.body) router.push(`/designer/${res.body.title}`);
            else router.push("/500_Admin");
          });
          return;
        }
        const title = (document.getElementById("title-selector") as HTMLInputElement).value;
        if (title === "Create New Exhibit") {
          return;
        }
        router.push(`/designer/${title}`);
      }}>
        <label htmlFor="title">Select an Exhibit to Open</label>
        <select name="title" id="title-selector" required>
          {exhibitCache && exhibitCache.map((exhibit, index) => (
            <option
              onClick={() => setCreateNew(false)} 
              key={index} 
              value={exhibit.title}
            >{exhibit.title}</option>
          ))}
          <option 
            value="Create New Exhibit"
            onClick={() => setCreateNew(true)}
          >Create New Exhibit</option>
        </select>
        {createNew && (
          <>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" required />
          </> 
        )}
        <button type="submit">Open</button>
      </form>
    </AdminLayout>
  );
}