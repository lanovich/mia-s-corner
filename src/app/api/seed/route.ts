import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { candles } from "@/constants";

export async function GET() {
  const { error: roleError } = await supabase
    .from("roles")
    .insert([
      { id: 1, name: "admin" },
      { id: 2, name: "customer" },
    ])
    .select();

  const { error: userError } = await supabase.from("users").insert([
    {
      phone_number: "+79998887766",
      password: "hashed_password_1",
      registered_at: new Date(),
      role_id: 1,
    },
    {
      phone_number: "+79995554433",
      password: "hashed_password_2",
      registered_at: new Date(),
      role_id: 2,
    },
  ]);

  const { error: categoryError } = await supabase
    .from("categories")
    .insert([
      { id: 1, name: "Свечи" },
      { id: 2, name: "Аромадиффузоры" },
      { id: 3, name: "Аромасаше" },
      { id: 4, name: "Прочее" },
    ])
    .select();

  const { data: historyData, error: historyError } = await supabase
    .from("history")
    .insert([
      { number: 1 },
      { number: 2 },
      { number: 3 },
      { number: 4 },
      { number: 5 },
    ])
    .select();

  if (historyError) {
    console.error("Ошибка при добавлении истории:", historyError);
    return NextResponse.json(
      { error: "Ошибка при добавлении истории", details: historyError },
      { status: 500 }
    );
  }

  const historyMap = historyData.reduce((acc, item) => {
    acc[item.number] = item.id;
    return acc;
  }, {} as Record<number, number>);

  const productsWithHistory = candles.map((candle) => ({
    title: candle.title,
    compound: candle.compound,
    size: candle.size,
    price: candle.price,
    quantity_in_stock: candle.quantity_in_stock,
    history_id: historyMap[candle.history_id],
    category_id: candle.category_id,
    image_url: candle.image_url,
  }));

  const { error: productError } = await supabase
    .from("products")
    .insert(productsWithHistory);

  if (roleError || userError || categoryError || productError) {
    return NextResponse.json(
      { error: "Ошибка при добавлении данных" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Данные успешно загружены" });
}
