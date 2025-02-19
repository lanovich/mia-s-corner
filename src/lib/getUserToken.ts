import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { supabase } from "./supabase";

export const getUserToken = async () => {
  let token = Cookies.get("user_token");

  if (!token) {
    token = uuidv4();
    console.log(token);
    Cookies.set("user_token", token, { expires: 365, path: "/" });

    // const { error } = await supabase
    //   .from("cart")
    //   .update({ token: token })
    //   .eq("user_id", 3)
    //   .select();

    // if (error) {
    //   console.log("Ошибка загрузки токена в БД");
    // }
  }

  return token;
};
