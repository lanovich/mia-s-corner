import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { phone_number, password } = req.body;

  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("phone_number", phone_number)
    .single();

  if (error || !data || data.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: data.id, role: data.role_id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res
    .status(200)
    .json({
      token,
      user: {
        id: data.id,
        phone_number: data.phone_number,
        role: data.role_id,
      },
    });
}
