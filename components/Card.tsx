import style from "@/styles/Card.module.css";

interface CardProps {
  src?: string
  alt?: string
}

export default function Card(
  { src, alt }: CardProps
) {
  const isYoutube = src?.includes('youtube.com')
  const videoId = src?.split('v=')[1];
  const embedUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  return (
    <div className={style.main}>
        <img
          className={style.image}
          src={isYoutube?embedUrl:src}
          alt={alt}
        />
    </div>
  );
}
