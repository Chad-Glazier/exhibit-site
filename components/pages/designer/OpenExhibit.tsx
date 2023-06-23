import { PopulatedExhibit, UserData } from "@/types";
import styles from "./OpenExhibit.module.css";
import { AdminLayout } from "@/components/layouts";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/util/client";
import { Alert, LoadingOverlay, TextEditor } from "@/components/general";

export default function OpenExhibit({
  exhibitCache,
  userData
}: {
  exhibitCache: PopulatedExhibit[];
  userData: UserData;
}) {
  const router = useRouter();
  const [createNew, setCreateNew] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <>
      <Alert message={alertMessage} setMessage={setAlertMessage} />
      <LoadingOverlay show={loading} />
      <AdminLayout
        pageName="Open Exhibit"
        userData={userData}
      >
        <form 
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);

            const title = createNew ? 
              (document.getElementById("title") as HTMLInputElement).value  
              : (document.getElementById("title-selector") as HTMLInputElement).value;

            if (createNew) {
              const res = await api.exhibit.post({
                title,
                summary: TextEditor.emptyEditorState(),
                thumbnail: "/no-image.png",
                cards: [],
                published: false,
                priority: 0
              });
              if (res.error) {
                setLoading(false);
                setAlertMessage(res.error);
                return;
              }
              if (res.body) {
                router.push(`/designer/${encodeURIComponent(res.body.title)}`);
                return;                            
              }
            }
            router.push(`/designer/${encodeURIComponent(title)}`);
          }}
        >
          <label 
            className={styles.label} 
            htmlFor="title"
          >
            Select an Exhibit to Open
          </label>
          <select
            className={styles.select} 
            name="title" 
            id="title-selector" 
            required
            onChange={(e) => {
              setCreateNew(e.target.value === `Create New Exhibit\u200B`);
            }}
          >
            <option 
              className={styles.option}
              value={`Create New Exhibit\u200B`}
            >
              Create New Exhibit
            </option>
            {exhibitCache && exhibitCache.map((exhibit, index) => 
              <option
                className={styles.option}
                key={index} 
                value={exhibit.title}
              >
                {exhibit.title}
              </option>
            )}
          </select>
          {createNew && (
            <>
              <label className={styles.label} htmlFor="title">
                Title
              </label>
              <input 
                className={styles.input} 
                type="text" name="title" id="title" 
                required 
              />
            </> 
          )}
          <button className={styles.button}>
            {(createNew ? "Create" : "Open") + " Exhibit"}
          </button>
        </form>
      </AdminLayout>    
    </>
  );
}