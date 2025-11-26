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
      slug: h.slug || "",
      order: h.order ?? 0,

      ...(h.description && { description: h.description }),
      ...(h.imageUrl && { imageUrl: h.imageUrl }),

      ...(h.episodes && {
        episodes: h.episodes.map((e) => ({
          id: e.id,
          historyId: e.historyId,

          ...(e.title && { title: e.title }),
          ...(e.number !== undefined && { number: Number(e.number) }),
          ...(e.storyText && { storyText: e.storyText }),
          ...(e.imageUrl && { imageUrl: e.imageUrl }),
        })),
      }),
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
