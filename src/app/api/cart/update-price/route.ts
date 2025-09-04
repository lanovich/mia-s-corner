import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const { fullPrice } = await req.json();

  if (typeof fullPrice !== "number" || isNaN(fullPrice)) {
    return NextResponse.json({ error: "Некорректная цена" }, { status: 400 });
  }

  const { error } = await supabase
    .from("cart")
    .update({ fullPrice: fullPrice })
    .eq("token", token);

  if (error) {
    console.error("Ошибка при обновлении full_price:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
