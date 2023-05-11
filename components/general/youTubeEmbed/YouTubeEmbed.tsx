import Image from "next/image";

export default function YouTubeEmbed({
  src,
  height,
  width,
  thumbnailOnly,
  onClick
}: {
  src: string;
  height: number;
  width: number;
  thumbnailOnly?: boolean;
  onClick?: () => void;
}) {
  let videoId = (src.split("v=")[1] || src.split("/").pop())?.split("&")[0];
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  return ( 
    <div
      onClick={onClick}
    >
      {thumbnailOnly ?
        <Image
          src={thumbnailUrl}
          alt={src}
          width={width}
          height={height}
        />
        :
        <iframe
          width={width}
          height={height}
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        />        
      }
    </div>
  );

}