import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { product, sizes } = await request.json();

    const { data: productData, error: productError } = await supabaseServer
      .from("products")
      .insert([product])
      .select()
      .single();

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    const sizesWithProductId = sizes.map((size: any) => ({
      ...size,
      product_id: productData.id,
    }));

    const { data: sizeData, error: sizeError } = await supabaseServer
      .from("sizes")
      .insert(sizesWithProductId)
      .select();

    if (sizeError) {
      return NextResponse.json({ error: sizeError.message }, { status: 500 });
    }

    return NextResponse.json({ productData, sizeData });
  } catch (error) {
    console.error("Ошибка в API-роуте:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
