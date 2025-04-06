import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { productId, description } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Необходимо указать ID продукта" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("products")
      .update({ description })
      .eq("id", productId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении описания:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении описания" },
      { status: 500 }
    );
  }
}
