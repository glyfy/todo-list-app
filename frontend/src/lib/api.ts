import { ApiError } from "../types/api";

function isJsonResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(path, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      credentials: "include",
    });
  } catch (e) {
    // Network error / request blocked / aborted, etc.
    throw new ApiError("Network error. Please check your connection.", 0);
  }

  const text = await res.text();

  let data: any = null;
  if (text && isJsonResponse(res)) {
    try {
      data = JSON.parse(text);
    } catch {
      // Bad JSON from server
      throw new ApiError("Server returned invalid JSON.", res.status);
    }
  }

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : text || `Request failed (${res.status})`;

    throw new ApiError(message, res.status);
  }

  return data as T;
}
