import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    // Валидация данных
    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Загрузка файла в Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from("photos") // Название бакета
      .upload(`images/${fileName}`, file, {
        contentType: file.type, // Указываем тип файла
      });

    if (error) {
      console.error("Ошибка при загрузке файла:", error);
      throw new Error(error.message);
    }

    // Получение публичной ссылки на файл
    const { data: urlData } = supabaseServer.storage
      .from("photos")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при загрузке изображения:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить изображение",
      },
      { status: 500 }
    );
  }
}
