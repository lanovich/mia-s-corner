type ApiFetchOptions = RequestInit & { revalidate?: number };

export async function apiFetch<T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { revalidate, ...init } = options;

  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

  const fullUrl = url.startsWith("http") ? url : baseUrl + url;

  const res = await fetch(fullUrl, {
    ...init,
    next: revalidate ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${url}`);
  }

  return res.json();
}
