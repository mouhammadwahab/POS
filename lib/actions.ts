"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { clearSession, setSession } from "./auth";
import { supabaseAdmin } from "./supabase";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) redirect("/?error=1");

  const { data, error } = await supabaseAdmin()
    .from("users")
    .select("username, password_hash, is_active")
    .eq("username", username)
    .maybeSingle();

  if (error || !data || data.is_active === false) redirect("/?error=1");

  const ok = await compare(password, data.password_hash as string);
  if (!ok) redirect("/?error=1");

  await setSession(data.username as string);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
