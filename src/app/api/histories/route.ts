import { NextResponse } from "next/server";
import { getHistories } from "@/shared/api/queries";

export async function GET() {
  try {
    const histories = await getHistories();

    return NextResponse.json(histories, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
