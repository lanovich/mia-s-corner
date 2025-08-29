import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image, order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    data.sort((a, b) => a.order - b.order),
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
