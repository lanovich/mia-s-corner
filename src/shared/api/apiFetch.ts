type ApiFetchOptions = RequestInit & { revalidate?: number };

export async function apiFetch<T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
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

  const res = await fetch(fullUrl, {
    ...init,
    next: revalidate ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${url}`);
  }

  return res.json();
}
