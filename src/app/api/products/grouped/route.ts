import { NextRequest, NextResponse } from "next/server";
import { getGroupedProducts } from "@/shared/api/queries";

export async function GET(req: NextRequest) {
  try {
    const result = await getGroupedProducts();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("❌ Серверная ошибка при загрузке grouped products:", err);
    return NextResponse.json({ error: "Серверная ошибка" }, { status: 500 });
  }
}
