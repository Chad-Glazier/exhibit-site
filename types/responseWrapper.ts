/**
 * This is a special type used by the `parseResponse` function in `@/util/client/ApiClient`.
 * When `ok` is `true`, there will definitely be a `body` property and there won't be an `error`.
 * When `ok` is `false`, there will definitely be an `error` property and there may be a `body`.
 * The cases that include both an `error` and a `body` are generally conflict errors, where the
 * error message is sent back and the body is the conflicting object. 
 */
export type ApiResponse<T> = {
  ok: boolean,
  status: number,
  error?: string,
  body?: T
} & (
  | { ok: true, body: T }
  | { ok: false, error: string }
);