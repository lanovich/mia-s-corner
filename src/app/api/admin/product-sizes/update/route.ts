import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id: sizeId,
      productId,
      price,
      oldPrice,
      quantity,
      isDefault,
      size,
      timeOfExploitation,
      dimensions,
    } = body;

    if (!sizeId || !productId) {
      return NextResponse.json(
        { error: "Необходимо указать ID размера и product_size" },
        { status: 400 }
      );
    }

    const { error: productSizeError } = await supabase
      .from("product_sizes")
      .update({
        price,
        oldPrice: oldPrice,
        quantity_in_stock: quantity,
        is_default: isDefault,
      })
      .eq("size_id", sizeId)
      .eq("product_id", productId);

    if (productSizeError) throw productSizeError;

    const { error: sizeError } = await supabase
      .from("sizes")
      .update({
        time_of_exploitation: timeOfExploitation,
        dimensions: dimensions,
        size: size,
      })
      .eq("id", sizeId);

    if (sizeError) throw sizeError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении размера:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении размера" },
      { status: 500 }
    );
  }
}
