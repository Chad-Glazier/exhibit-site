import styles from "./Dashboard.module.css";
import { PopulatedExhibit, PopulatedExhibitCreatable, UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { useState } from "react";
import { Popup } from "@/components/general";
import { exhibit } from "@/util/client";
import ExhibitTile from "./ExhibitTile";

export default function Dashboard({ 
  exhibits 
}: { 
  userData: UserData, 
  exhibits: PopulatedExhibit[] 
}) {
  const [exhibitCache, setExhibitCache] = useState<PopulatedExhibitCreatable[]>(exhibits);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <AdminLayout>
      <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
        <form 
          onSubmit={() => {
            const baseTitle = (document.getElementById("name") as HTMLInputElement).value;
            let newTitle = baseTitle;
            for (let i = 1; exhibitCache.map(el => el.title).includes(newTitle); i++) {
              newTitle = baseTitle + ` (${i})`;
            }
            const newExhibit: PopulatedExhibitCreatable = {
              title: newTitle,
              summary: "",
              thumbnail: "/add.png",
              cards: [],
              published: false
            }
            exhibit.post(newExhibit)
              .then(res => {
                // this handles a specific edge case where two users have browsers open,
                // and they both attempt to create a new exhibit with the same name.
                if (!res.ok && res.body) {
                  setExhibitCache(prev => prev.map(el => {
                    if (el.title === res.body?.title) {
                      return res.body;
                    }
                    return el;
                  }));
                }
              })
            setExhibitCache(prev => [...prev, newExhibit]);
            setShowPopup(false);
          }
        }>
          <h1>Add Exhibit!</h1>
          <label htmlFor="name">New Exhibit Title</label>
          <input type="text" name="name" id="name" required />
          <button>Create</button>          
        </form>
      </Popup>
      <main className={styles.dashboard}>
        <h1 className={styles.heading}>Exhibits</h1>
        {exhibitCache.map((el, index) => 
          <ExhibitTile 
            key={index} 
            exhibit={el} 
            onDelete={() => {
              exhibit.deleteOne(el.title);
              setExhibitCache(prev => prev.filter(({ title }) => title !== el.title))
            }}
          />
        )}
        <button onClick={() => setShowPopup(true)}>
          Add Exhibit
        </button>
      </main>
    </AdminLayout>
  )
}
