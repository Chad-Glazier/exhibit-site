import styles from "./Details.module.css";
import { Popup } from "@/components/general";
import Link from "next/link";

export default function Details({
  show,
  imageName,
  imageUrl,
  dependantExhibits,
  onClose
}: {
  show: boolean;
  imageName: string;
  imageUrl: string;
  dependantExhibits: string[];
  onClose: () => void;
}) {
  return (
    <Popup
      show={show}
      onClickAway={onClose}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>
          {imageName}
        </h2>
        <p>
          Full image path:
          <br />
          <Link
            className={styles.link}
            target="_blank"
            href={imageUrl}
          >
            {imageUrl}
          </Link>
        </p>
        {dependantExhibits.length > 0 ?
          <>
            <p>
              This image is used in the following exhibits:
            </p>
            <ul>
              {Array.from(dependantExhibits).map(exhibitTitle => (
                <li key={exhibitTitle}>
                  <Link 
                    className={styles.link}
                    target="_blank"
                    href={`/designer/${encodeURIComponent(exhibitTitle)}`}
                  >
                    {exhibitTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </>
          :
          <p>
            This image is not used in any exhibits.
          </p>
        }
        <button className={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </Popup>
  )
}