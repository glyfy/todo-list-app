// src/lib/api.ts
type ApiError = { error: string };

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "include", // remove if you're NOT using cookies
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = (data ?? {}) as ApiError;
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return data as T;
}
