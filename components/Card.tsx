import style from "@/styles/Card.module.css";

interface CardProps {
  src?: string
  alt?: string
}

export default function Card(
  { src, alt }: CardProps
) {
  const isYoutube = src?.includes('youtube.com')
  return (
    <div className={style.main}>
        <img
          className={style.image}
          src={isYoutube?'https://img.youtube.com/vi/cV0_DFkJU_w/0.jpg':src}
          alt={alt}
        />
    </div>
  );
}
