import { Exhibit } from "@prisma/client";
import style from "@/styles/ExhibitThumbnail.module.css";
import Link from "next/link";

interface ExhibitThumbnailProps extends Exhibit {
  designer?: boolean
}

export default function ExhibitThumbnail(
  { title, thumbnail, summary, designer }: ExhibitThumbnailProps
) {
  return (
    <div className={style.exhibitThumbnail}>
      <Link
        href={
          designer ? 
          `/admin/designer/${title.replace(" ", "-")}`
          : `/exhibit/${title.replace(" ", "-")}`}
      >
        <img
          className={style.thumbnailImage}
          src={`/exhibit-media/thumbnails/${thumbnail}`}
          alt={title}
        />
        <div className={style.title}>{title}</div>
        <div className={style.summary}>{summary}</div>
      </Link>
    </div>
  );
}
