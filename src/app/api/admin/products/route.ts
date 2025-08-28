import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/client/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      category_id,
      category_slug,
      compound,
      episode,
      episode_number,
      measure,
      slug,
      size_ids = [],
    } = body;

    if (!title || !category_id) {
      return NextResponse.json(
        { error: "Необходимо указать название и категорию" },
        { status: 400 }
      );
    }

    const productData = {
      title,
      category_id: Number(category_id),
      category_slug,
      compound: compound || "",
      episode: episode || null,
      episode_number,
      measure: measure || "",
      slug,
      history_id: Math.floor(Number(episode_number)) || 0,
      description: "",
      images: [],
      scent_pyramid: { top: "", base: "", heart: "" },
    };

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (productError) throw productError;

    const sizePromises = size_ids.map(async (sizeId: number) => {
      const sizeData = {
        is_default: sizeId === size_ids[0],
        oldPrice: null,
        price: 0,
        product_id: product.id,
        quantity_in_stock: 0,
        size_id: sizeId,
      };

      const { error } = await supabase.from("product_sizes").insert(sizeData);

      if (error)
        console.error(`Ошибка при добавлении размера ${sizeId}:`, error);
      return !error;
    });

    await Promise.all(sizePromises);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ошибка при создании товара",
      },
      { status: 500 }
    );
  }
}
