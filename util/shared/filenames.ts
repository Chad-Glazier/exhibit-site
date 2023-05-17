/**
 * @param filename the name of the file whos basename you want to get
 * @returns the basename of the file, without the extension
 */
export function getBasename(filename: string): string {
  const startingIndex = filename.lastIndexOf("/") + 1;
  const endingIndex = filename.lastIndexOf(".");

  return filename.substring(startingIndex, endingIndex);
}

/**
 * @param filename the name of the file whos extension you want to get
 * @returns the file extension, including the dot
 */
export function getExtension(filename: string, omitDot?: boolean): string {
  filename = filename.split("/").pop() || "";
  let startingIndex = filename.lastIndexOf(".");
  if (startingIndex === -1) {
    return "";
  }
  if (omitDot) {
    startingIndex++;
  }
  return filename.substring(startingIndex);
}