import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { supabase } from "@/shared/api/supabase/client";

export const getUserToken = async () => {
  let token = Cookies.get("user_token");

  if (!token) {
    token = uuidv4();
    Cookies.set("user_token", token, { expires: 365, path: "/" });

    const { error } = await supabase
      .from("cart")
      .upsert([{ token }], { onConflict: "token" })
      .select();

    if (error) {
      console.error("Ошибка создания корзины:", error.message);
    }
  }

  return token;
};
