export function isYouTube(url: string): boolean {
  return /^(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?$/.test(url);
}

/**
 * Get the YouTube video ID from a YouTube URL.
 * Returns `null` if the URL is not a valid YouTube URL.
 */
export function getYouTubeId(url: string): string | null {
  if (!isYouTube(url)) return null;
  return (url.split("v=")[1] || url.split("/").pop())?.split("&")[0] ?? null;
}

/**
 * Makes a request to the YouTube API to get the title of a YouTube video from its URL.
 */
export async function getYouTubeTitle(url: string): Promise<string | null> {
  const id = getYouTubeId(url);
  if (!id) return null;
  const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`);
  const { title } = await response.json();
  return title ?? null;
}