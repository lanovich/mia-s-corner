import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import type { HistoryData } from "@/entities/history/model";

export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      orderBy: { order: "asc" },
      include: {
        episodes: {
          orderBy: { number: "asc" },
        },
      },
    });

    const result: HistoryData[] = histories.map((h) => ({
      id: h.id,
      title: h.title,
      slug: h.slug ?? "",
      description: h.description ?? undefined,
      order: h.order ?? 0,
      imageUrl: h.imageUrl ?? undefined,
      episodes: h.episodes.map((e) => ({
        id: e.id,
        historyId: e.historyId,
        title: e.title ?? undefined,
        number: e.number ? Number(e.number) : undefined,
        storyText: e.storyText ?? undefined,
        imageUrl: e.imageUrl ?? undefined,
      })),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching histories:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch histories" },
      { status: 500 }
    );
  }
}
