import { supabaseAdmin } from "./supabase";

type Row = Record<string, unknown>;

export async function fetchAll(table: string, orderBy: string) {
  const client = supabaseAdmin();
  const rows: Row[] = [];
  const pageSize = 1000;
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await client
      .from(table)
      .select("*")
      .order(orderBy, { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    const batch = (data ?? []) as Row[];
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}

export function num(value: unknown) {
  return Number(value ?? 0);
}

export function text(value: unknown) {
  if (value == null || value === "") return "—";
  return String(value);
}
