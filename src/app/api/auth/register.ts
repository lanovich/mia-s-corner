import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  phone_number: z.string().min(10),
  password: z.string().min(6),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { phone_number, password } = req.body;

  const { data, error } = await supabase
    .from("Users")
    .insert([{ phone_number, password, registered_at: new Date(), role_id: 2 }])
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "User registered successfully" });
}
