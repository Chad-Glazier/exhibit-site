import Image from "next/image";
import { getYouTubeId } from "@/util";
import styles from "./YouTubeEmbed.module.css";

export default function YouTubeEmbed({
  className,
  title,
  src,
  height,
  width,
  thumbnailOnly,
  onClick
}: {
  className?: string;
  title?: string;
  src: string;
  height: number;
  width: number;
  thumbnailOnly?: boolean;
  onClick?: () => void;
}) {
  let videoId = getYouTubeId(src);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return ( 
    <div
      onClick={onClick}
      title={title}
    >
      {thumbnailOnly ?
        <Image
          className={className}
          src={thumbnailUrl}
          alt={src}
          width={width}
          height={height}
          style={{
            objectFit: "cover"
          }}
        />
        :
        <iframe
          className={className}
          width={width}
          height={height}
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
          style={{
            width: "100%",
            flexGrow: 1,
            aspectRatio: "16 / 9"
          }}
        />             
      }
    </div>
  );

}