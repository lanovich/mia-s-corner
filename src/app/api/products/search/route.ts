import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// переписать для получения по массивуу запахов или убрать вовсе

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`title.ilike.%${query}%, compound.ilike.%${query}%`).limit(5);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}
