import { Exhibit } from "@prisma/client";
import style from "@/styles/ExhibitThumbnail.module.css";

interface ExhibitThumbnailProps extends Exhibit {}

export default function ExhibitThumbnail(
  { title, thumbnail, summary }: ExhibitThumbnailProps
) {
  return (
    <div className={style.exhibitThumbnail}>
      <img
        className={style.thumbnailImage}
        src={`/exhibit-media/thumbnails/${thumbnail}`}
        alt={title}
      />
      <div className={style.title}>{title}</div>
      <div className={style.summary}>{summary}</div>
    </div>
  );
}