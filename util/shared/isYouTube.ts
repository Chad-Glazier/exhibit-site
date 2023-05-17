export const youTubePattern = "^(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?$";

export default function isYouTube(url: string): boolean {
  return /^(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?$/.test(url);
}