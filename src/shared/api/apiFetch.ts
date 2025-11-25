type ApiFetchOptions = RequestInit & { revalidate?: number };

export async function apiFetch<T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T | null> {
  const { revalidate, ...init } = options;

  const isServer = typeof window === "undefined";

  let fullUrl: string;
  if (url.startsWith("http")) {
    fullUrl = url;
  } else if (isServer) {
    const host = process.env.NEXT_PUBLIC_SITE_URL;
    if (!host) throw new Error("NEXT_PUBLIC_SITE_URL is not defined on server");
    fullUrl = host + url;
  } else {
    fullUrl = url;
  }

  try {
    const res = await fetch(fullUrl, {
      ...init,
      next: revalidate ? { revalidate } : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`API error ${res.status} on ${url}: ${text}`);
      return null;
    }

    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`❌ Network or fetch error on ${url}:`, err);
    return null;
  }
}
