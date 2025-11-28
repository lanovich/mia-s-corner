import { MetadataRoute } from "next";
import { Category } from "@/entities/category/model";
import { HistoryData } from "@/entities/history/model";
import { API, apiFetchServer } from "@/shared/api";
import { ShortProduct } from "@/entities/product/model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL!;
  const currentDate = new Date().toISOString();

  const [categories, histories, products] = await Promise.all([
    apiFetchServer<Category[]>(API.categories.getCategories, {
      revalidate: 3600,
      fallback: [],
    }),
    apiFetchServer<HistoryData[]>(API.histories.getHistories, {
      revalidate: 3600,
      fallback: [],
    }),
    apiFetchServer<ShortProduct[]>(API.products.getProducts, {
      revalidate: 3600,
      fallback: [],
    }),
  ]);

  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  const categoryPages = categories
    ? categories.map((category: Category) => ({
        url: `${baseUrl}/catalog/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    : [];

  const historyPages = histories
    ? histories.map((history: HistoryData) => ({
        url: `${baseUrl}/catalog/histories/${history.id}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    : [];

  const productPages = products
    ? products.map((product) => ({
        url: `${baseUrl}/catalog/${product.categorySlug}/product/${product.slug}`,
        lastModified: new Date(currentDate),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
    : [];

  return [...staticPages, ...categoryPages, ...historyPages, ...productPages];
}
