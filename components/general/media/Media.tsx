import styles from "./Media.module.css";
import { isYouTube } from "@/util";
import { getYouTubeId } from "@/util";
import Image from "next/image";
import { MouseEventHandler } from "react";

/**
 * Takes a URL and returns either an `iframe` or an `img`:
 * 
 * - if the URL is a YouTube video *and* `active` is not false, then
 *   an `iframe` is returned with the embedded video player.
 * 
 * - otherwise, an `img` is returned with the URL as the `src`.
 * 
 * Whether or not the URL is a YouTube video is determined by a regular
 * expression.
 */
export default function Media({
  url,
  className,
  active,
  width,
  height,
  alt,
  onClick
}: {
  url: string;
  className?: string;
  active?: boolean;
  width?: number;
  height?: number;
  alt?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
}) {
  let videoId = getYouTubeId(url);

  height ??= 800;
  width ??= 1000;
  active ??= true;
  alt ??= "media";

  if (videoId === null) {
    return <Image
      className={className}
      src={url}
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
    />;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (active) {
    return <iframe
      className={className}
      width={width}
      height={height}
      src={embedUrl}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowFullScreen
      title={alt}
    />;
  }

  return <Image
    className={className}
    src={thumbnailUrl}
    width={width}
    height={height}
    alt={alt}
    onClick={onClick}
  />
}