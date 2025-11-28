export type ApiFetchServerOptions = {
  revalidate?: number;
  fallback?: any;
  init?: RequestInit;
};

export async function apiFetchServer<T>(
  path: string,
  options: ApiFetchServerOptions = {}
): Promise<T> {
  const { revalidate, fallback, init } = options;

  const baseUrl = process.env.SITE_URL;
  if (!baseUrl) {
    throw new Error("Environment variable SITE_URL is missing");
  }

  const url = path.startsWith("http") ? path : baseUrl + path;

  try {
    const res = await fetch(url, {
      ...init,
      next: revalidate ? { revalidate } : undefined,
    });

    if (!res.ok) {
      console.error(`apiFetchServer: ${res.status} error on ${url}`);
      if (fallback !== undefined) return fallback;
      throw new Error(`Request failed: ${url}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("apiFetchServer error:", err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}
