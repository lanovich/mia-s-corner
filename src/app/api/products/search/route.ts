import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "";
  const category = req.nextUrl.searchParams.get("category");

  let builder = supabase
    .from("products")
    .select("id, title, compound, category_slug, slug, images")
    .textSearch("search", query, { type: "websearch", config: "russian" });

  if (category) {
    builder = builder.eq("category_slug", category);
  }

  const { data, error } = await builder.limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
