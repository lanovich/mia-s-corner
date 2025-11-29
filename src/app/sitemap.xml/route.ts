import { NextResponse } from "next/server";
import { categoriesApi } from "@/entities/category/api";
import { historiesApi } from "@/entities/history/api";
import { productsApi } from "@/entities/product/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.SITE_URL!;
  const currentDate = new Date().toISOString();

  console.log("Fetching categories, histories, products...");

  const [rawCategories, rawHistories, rawProducts] = await Promise.all([
    categoriesApi.fetchCategories(),
    historiesApi.fetchHistories(),
    productsApi.fetchAllProducts(),
  ]);

  console.log("Categories:", rawCategories?.length);
  console.log("Histories:", rawHistories?.length);
  console.log("Products:", rawProducts?.length);

  const categories = rawCategories ?? [];
  const products = rawProducts ?? [];
  const histories = rawHistories ?? [];
  console.log({
    categories: categories.length,
    products: products.length,
    histories: histories.length,
  });

  const urls = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/catalog`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacts`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.3,
    },
    ...categories.map((c) => ({
      url: `${baseUrl}/catalog/${c.slug}`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    })),
    ...histories.map((h) => ({
      url: `${baseUrl}/catalog/histories/${h.id}`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/catalog/${p.categorySlug}/product/${p.slug}`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.7,
    })),
  ];

  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (u) => `
        <url>
          <loc>${u.url}</loc>
          <lastmod>${u.lastmod}</lastmod>
          <changefreq>${u.changefreq}</changefreq>
          <priority>${u.priority}</priority>
        </url>
      `
        )
        .join("")}
    </urlset>
  `.trim();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
