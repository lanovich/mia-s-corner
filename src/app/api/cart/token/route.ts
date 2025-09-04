import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/shared/api/supabase/server";

export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get("user_token")?.value;

  let token = tokenCookie;

  if (!token) {
    token = uuidv4();

    const { error } = await supabase
      .from("cart")
      .upsert([{ token }], { onConflict: "token" });

    if (error) {
      console.error("Ошибка создания корзины:", error.message);
      return new Response(
        JSON.stringify({ error: "Ошибка создания корзины" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  const res = new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  res.headers.set(
    "Set-Cookie",
    `user_token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 365}`
  );

  return res;
}
