const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export async function apiFetch<T>(
  url: string,
  options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const { revalidate, ...init } = options;

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${url}`, {
    ...init,
    next: revalidate ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
