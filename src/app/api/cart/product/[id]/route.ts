import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, props: { params: Params }) {
  const params = await props.params;
  const productId = Number(params.id);

  const { data, error } = await supabase
    .from("products")
    .select(`*, product_sizes:product_sizes!product_id(*, size:size_id(*))`)
    .eq("id", productId)
    .single();

  if (error || !data) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({
    ...data,
    sizes: data.product_sizes.map((ps: any) => ({
      ...ps.size,
      price: ps.price,
      oldPrice: ps.oldPrice,
      quantity_in_stock: ps.quantity_in_stock,
      is_default: ps.is_default,
    })),
  });
}
