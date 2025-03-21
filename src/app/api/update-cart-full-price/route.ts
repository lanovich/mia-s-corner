import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, fullPrice } = await req.json();

    if (typeof fullPrice !== "number" || isNaN(fullPrice)) {
      return NextResponse.json(
        { error: "Ошибка: fullPrice должен быть числом." },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Ошибка: токен не предоставлен." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("cart")
      .update({ fullPrice })
      .eq("token", token);

    if (error) {
      return NextResponse.json(
        { error: "Ошибка при обновлении fullPrice: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка в API-роуте:", error);
    return NextResponse.json(
      { error: "Произошла внутренняя ошибка сервера." },
      { status: 500 }
    );
  }
}
