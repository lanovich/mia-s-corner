import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Ошибка в /api/categories/[slug]:", error);
    console.error("Slug в /api/histories/[slug]:", slug);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? data.name : null);
}
