import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const {
      title,
      history_id,
      category_id,
      compound,
      slug,
      category_slug,
      scent_pyramid,
      description,
      images,
      measure,
      episode,
      episode_number,
      product_sizes,
    } = await request.json();

    // Валидация данных
    if (
      !title ||
      !history_id ||
      !category_id ||
      !compound ||
      !slug ||
      !category_slug ||
      !description ||
      !measure ||
      !episode ||
      !episode_number ||
      !images ||
      !product_sizes
    ) {
      return NextResponse.json(
        { error: "Не все обязательные поля заполнены" },
        { status: 400 }
      );
    }

    // Добавление продукта в таблицу products
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          title,
          history_id,
          category_id,
          compound,
          slug,
          category_slug,
          scent_pyramid: scent_pyramid, // Преобразуем объект в JSON
          description,
          images: images, // Преобразуем массив в JSON
          measure,
          episode,
          episode_number,
        },
      ])
      .select()
      .single();

    if (productError) {
      console.error("Ошибка при добавлении продукта:", productError);
      throw new Error(productError.message);
    }

    // Добавление размеров в таблицу product_sizes
    for (const size of product_sizes) {
      const { error: sizeError } = await supabase.from("product_sizes").insert({
        product_id: product.id,
        size_id: size.size_id,
        price: size.price,
        oldPrice: size.oldPrice,
        quantity_in_stock: size.quantity_in_stock,
        is_default: size.is_default,
      });

      if (sizeError) {
        console.error("Ошибка при добавлении размера:", sizeError);
        throw new Error(sizeError.message);
      }
    }

    return NextResponse.json(
      { message: "Продукт успешно добавлен", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    return NextResponse.json(
      { error: error || "Не удалось добавить продукт" },
      { status: 500 }
    );
  }
}
