import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("sizes").select("*");

  if (error) {
    console.error("Ошибка загрузки размеров:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
