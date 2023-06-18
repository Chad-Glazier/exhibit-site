import styles from "./Dashboard.module.css";
import { CardType, PopulatedExhibit, PopulatedExhibitCreatable, UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { useState } from "react";
import { LoadingOverlay } from "@/components/general";
import { api } from "@/util/client";
import ExhibitTile from "./ExhibitTile";
import AddExhibit from "./popups/AddExhibit";
import Image from "next/image";

export default function Dashboard({ 
  userData,
  exhibits 
}: { 
  userData: UserData, 
  exhibits: PopulatedExhibit[] 
}) {
  const [exhibitCache, setExhibitCache] = useState<PopulatedExhibitCreatable[]>(exhibits);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function deleteExhibit(exhibit: PopulatedExhibitCreatable) {
    setLoading(true);
    const res = await api.exhibit.deleteOne(exhibit.title);
    if (!res.ok) {
      alert(res.error);
    } else {
      setExhibitCache(prev => prev.filter(({ title }) => title !== exhibit.title))
    }
    setLoading(false);
  }

  async function togglePublic(exhibit: PopulatedExhibitCreatable) {
    setLoading(true);
    const res = await api.exhibit.put({ ...exhibit, published: !exhibit.published });
    if (!res.ok) {
      alert(res.error);
    } else {
      setExhibitCache(prev => prev.map(el => {
        if (el.title === exhibit.title) {
          return { ...exhibit, published: !exhibit.published};
        }
        return el;
      }));
    }
    setLoading(false);
  }

  const publicExhibits = exhibitCache.filter(el => el.published);
  const privateExhibits = exhibitCache.filter(el => !el.published);

  return (
    <>
      <LoadingOverlay show={loading} />
      <AddExhibit
        show={showPopup && !loading}
        existingExhibits={exhibitCache}
        onCancel={() => setShowPopup(false)}
        onCreate={(newExhibit) => {
          setExhibitCache(prev => [...prev, newExhibit]);
          setShowPopup(false);
        }}
      />
      <AdminLayout
        pageName="Dashboard"
        className={styles.page}
        userData={userData}
      >
        {
          publicExhibits.length > 0 &&
          <>
            <h1 className={styles.heading}>Published Exhibits</h1>
            <div className={styles.exhibits}>
              {publicExhibits.map((el) => 
                  <ExhibitTile 
                    allExhibits={exhibitCache}
                    key={el.title} 
                    exhibit={el} 
                    onDelete={() => deleteExhibit(el)}
                    onTogglePublic={togglePublic}
                    onChangeTitle={(newTitle) => {
                      setExhibitCache(prev => prev.map(ex => {
                        if (ex.title === el.title) {
                          return { ...ex, title: newTitle };
                        }
                        return ex;
                      }));
                    }}
                  />
                )
              }  
            </div>
          </>
        }
        {
          privateExhibits.length > 0 &&
          <>
            <h1 className={styles.heading}>Unpublished Exhibits</h1>
            <section className={styles.exhibits}>
              {privateExhibits.map((el, index) => 
                  <ExhibitTile 
                    allExhibits={exhibitCache}
                    key={index} 
                    exhibit={el} 
                    onDelete={() => deleteExhibit(el)}
                    onTogglePublic={togglePublic}
                    onChangeTitle={(newTitle) => {
                      setExhibitCache(prev => prev.map(ex => {
                        if (ex.title === el.title) {
                          return { ...ex, title: newTitle };
                        }
                        return ex;
                      }));
                    }}
                  />
                )
              }
            </section>
          </>
        } 
        <Image 
          src="/plus.svg"
          alt="Add Exhibit"
          width={100}
          height={120}
          className={styles.button} 
          onClick={() => setShowPopup(true)}
        />
      </AdminLayout>    
    </>
  );
}
