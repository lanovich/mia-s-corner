import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  let query = req.nextUrl.searchParams.get("query");

  if (!query) {
    const { data, error: categoryError } = await supabase
      .from("products")
      .select("*")


    if (categoryError) {
      console.error("Supabase error fetching all products:", categoryError);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  }

  if (isNaN(Number(query))) {
    return NextResponse.json({ error: "Invalid category ID. Category ID must be a number." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", Number(query));

  if (error) {
    console.error("Supabase error fetching products by category:", error);
    return NextResponse.json({ error: "Failed to fetch products by category" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
