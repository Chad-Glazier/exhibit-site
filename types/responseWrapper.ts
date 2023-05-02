export type ApiResponse<T> = {
  ok: boolean,
  status: number,
  error?: string,
  body?: T
} & (
  | { ok: true, body: T }
  | { ok: false, error: string }
);