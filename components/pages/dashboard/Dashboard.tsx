import styles from "./Dashboard.module.css";
import { PopulatedExhibit, PopulatedExhibitCreatable, UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { useState } from "react";
import { Popup, LoadingOverlay } from "@/components/general";
import { api } from "@/util/client";
import ExhibitTile from "./ExhibitTile";

export default function Dashboard({ 
  exhibits 
}: { 
  userData: UserData, 
  exhibits: PopulatedExhibit[] 
}) {
  const [exhibitCache, setExhibitCache] = useState<PopulatedExhibitCreatable[]>(exhibits);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <AdminLayout>
        <Popup show={showPopup} onClickAway={() => setShowPopup(false)}>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();

              const baseTitle = (document.getElementById("name") as HTMLInputElement).value;
              let newTitle = baseTitle;
              for (let i = 1; exhibitCache.map(el => el.title).includes(newTitle); i++) {
                newTitle = baseTitle + ` (${i})`;
              }
              const newExhibit: PopulatedExhibitCreatable = {
                title: newTitle,
                summary: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                thumbnail: "/add.png",
                cards: [],
                published: false
              }
              setLoading(true);
              const res = await api.exhibit.post(newExhibit);
              if (!res.ok) {
                alert(res.error);
              } else {
                setExhibitCache(prev => [...prev, newExhibit]);
              }
              setLoading(false);
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
              onDelete={async () => {
                setLoading(true);
                const res = await api.exhibit.deleteOne(el.title);
                if (!res.ok) {
                  alert(res.error);
                } else {
                  setExhibitCache(prev => prev.filter(({ title }) => title !== el.title))
                }
                setLoading(false);
              }}
              onTogglePublic={async (exhibit) => {
                setExhibitCache(prev => prev.map(el => {
                  if (el.title === exhibit.title) {
                    return { ...exhibit, published: !exhibit.published};
                  }
                  return el;
                }));
                const res = await api.exhibit.put({ ...exhibit, published: !exhibit.published });
                if (!res.ok) {
                  alert(res.error);
                  setExhibitCache(prev => prev.map(el => {
                    if (el.title === exhibit.title) {
                      return { ...exhibit, published: !exhibit.published};
                    }
                    return el;
                  }));
                }
              }}
            />
          )}
          <button onClick={() => setShowPopup(true)}>
            Add Exhibit
          </button>
        </main>
      </AdminLayout>    
    </>

  )
}
