export const youTubeRegExp = /^(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?$/;
export const youTubePattern = "^(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?$";

export default function isYouTube(url: string): boolean {
  return RegExp(youTubeRegExp).test(url);
}