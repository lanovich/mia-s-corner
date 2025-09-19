import { HistoryData } from "@/entities/history/model";
import { supabase } from "@/shared/api/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("histories")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    console.error("Ошибка в /api/histories/[id]:", error);
    console.error("ID в /api/histories/[id]:", id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? (data as HistoryData) : null);
}
