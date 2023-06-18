import { PopulatedExhibitCreatable, ExhibitCreatable } from "@/types";
import { LoadingOverlay, Popup } from "@/components/general";
import { api } from "@/util/client";
import { isYouTube, getBasename, getYouTubeTitle } from "@/util";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Details.module.css";

export default function Details({
  show,
  close,
  exhibit,
  allExhibits,
  onChangeTitle,
}: {
  show?: boolean;
  close: () => void;
  exhibit: PopulatedExhibitCreatable;
  allExhibits: PopulatedExhibitCreatable[];
  requestRerender?: () => void;
  onChangeTitle: (newTitle: string) => void;
}) {
  const { cards, ...exhibitDetails } = exhibit;
  const [lastSavedVersion, setLastSavedVersion] = useState(exhibitDetails);
  const youTubeTitles = useRef(new Map<string, string>());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    exhibit.cards
      .map(({ media }) => media)
      .filter(isYouTube)
      .forEach(async (media) => {
        let title = await getYouTubeTitle(media);
        if (title === null) {
          console.error("Failed to get YouTube title for " + media);
          title = "No Title";
        }
        if (title.length > 50) {
          title = title.substring(0, 47) + "...";
        }
        youTubeTitles.current.set(media, title);
      });
  }, [exhibit.cards, youTubeTitles]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={show && !loading} onClickAway={close}>
        <form className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const title = (document.getElementById("title") as HTMLInputElement).value;

            if (
              title !== exhibit.title
              &&
              allExhibits.some(exhibit => exhibit.title === title)
            ) {
              alert("An exhibit with that title already exists.");
              return;
            }

            const priority = parseInt((document.getElementById("priority") as HTMLSelectElement).value);
            
            const updatedDetails = {
              ...exhibitDetails,
              title,
              priority
            };

            if (JSON.stringify(updatedDetails) === JSON.stringify(lastSavedVersion)) {
              close();
              return;
            }

            setLoading(true);
            const res = await api.exhibit.updateOne(
              exhibit.title,
              updatedDetails
            );
            setLoading(false);

            onChangeTitle(title);

            if (!res.ok) {
              alert(res.error);
              return;
            }

            setLastSavedVersion(res.body);
            close();
          }}
        >
          <Image
            className={styles.background}
            src={exhibit.thumbnail}
            alt={exhibit.title}
            width={1000}
            height={1000}
          />
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input 
            id="title"
            type="text" 
            required 
            className={styles.input}
            defaultValue={exhibit.title}
          />
          <label 
            className={styles.label} 
            htmlFor="priority"
            title="The priority of an exhibit determines how it is ordered on the home page. Higher priority exhibits are placed first."
          >
            Priority
          </label>
          <select
            id="priority"
            className={styles.select}
            title="The priority of an exhibit determines how it is ordered on the home page. Higher priority exhibits are placed first."
            defaultValue={lastSavedVersion.priority}
          >
            {["low", "medium", "high"].map((str, index) =>
              <option key={index} value={index}>
                {str}
              </option>
            )}
          </select>
          {
          [
            ...exhibit.cards.map(x => x.media), 
            exhibit.thumbnail
          ]
          .some(url => !url.startsWith("/")) &&
            <>
              <label htmlFor="media" className={styles.label}>
                Media
              </label> 
              <div id="media" className={styles.tableContainer}>
                <table className={styles.table}>
                  <tbody>
                    {
                    [
                      ...exhibit.cards.map(x => x.media), 
                      exhibit.thumbnail
                    ]
                      .filter(media => !media.startsWith("/"))
                      .map((media, index) =>
                      <tr key={index}>
                        <td>
                          {isYouTube(media) ? 
                            <Link 
                              href={media} 
                              className={styles.link} 
                              target="_blank"
                              title="Open in YouTube"
                            >
                              {youTubeTitles.current.get(media) ?? "Loading..."}
                            </Link>
                            :
                            <Link 
                              title="Open in Gallery"
                              href={`/gallery?image=${encodeURIComponent(media)}`} 
                              className={styles.link} 
                              target="_blank"
                            >
                              {decodeURIComponent(getBasename(media))}
                            </Link>
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>              
            </>       
          }
          <div className={styles.buttons}>
            <button
              className={styles.button}
            >
              Save Changes
            </button>
            <button
              className={styles.button}
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </Popup>
    </>
  );
}
