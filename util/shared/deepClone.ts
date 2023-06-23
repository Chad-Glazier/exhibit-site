/**
 * Recursively copies an object. 
 */
export default function deepClone<T>(obj: T): T {
  let clone: Partial<T> = {};

  if (Array.isArray(obj)) return obj.map(deepClone) as T;

  for (let key in obj) {
    if (typeof obj[key] === "function") {
      clone[key] = obj[key];
      continue;
    }
    if (typeof obj[key] === "object") {
      clone[key] = deepClone(obj[key]);
      continue;
    }
    clone[key] = obj[key];
  }
  
  return clone as T;
}
