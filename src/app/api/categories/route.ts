import { NextResponse } from "next/server";
import { getCategories } from "@/shared/api/queries";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
