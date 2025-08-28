import { getRandomSlugs } from "@/shared/api/supabase/queries";
import { chooseRandomItem } from "@/shared/lib";
import { LINKS } from "@/shared/model";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not defined in environment variables"
    );
  }

  const slugs = await getRandomSlugs();
  const randomSlug = chooseRandomItem(slugs);

  const redirectUrl = randomSlug
    ? new URL(
        `${LINKS.CATALOG}/${randomSlug.category_slug}/${LINKS.PRODUCT}/${randomSlug.slug}`,
        baseUrl
      )
    : new URL("/catalog/candles/ona-vlyubilasь-v-prostaka", baseUrl);

  return NextResponse.redirect(redirectUrl);
}
