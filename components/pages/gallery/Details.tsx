import styles from "./Details.module.css";
import { Popup } from "@/components/general";
import Link from "next/link";
import Image from "next/image";

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
        <Image
          className={styles.image}
          src={imageUrl}
          height={600}
          width={600}
          alt={imageName}
        />
        <h2 className={styles.title}>
          {imageName}
        </h2>
        {dependantExhibits.length > 0 ?
          <>
            <p>
              This image is used in the following exhibit{dependantExhibits.length > 1 ? "s" : ""}:
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
          <em>
            This image is not used in any exhibits.
          </em>
        }
        <button className={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </Popup>
  )
}