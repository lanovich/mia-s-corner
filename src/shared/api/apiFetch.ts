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
    const host = process.env.NEXT_PUBLIC_BASE_URL;
    if (!host) throw new Error("NEXT_PUBLIC_BASE_URL is not defined on server");
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
      const text = await res.text().catch(() => "");
      console.error(`API fetch error ${res.status} on ${fullUrl}: ${text}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
