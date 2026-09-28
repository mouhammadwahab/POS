import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { readSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await readSession();
  if (!username) redirect("/");
  return <Shell username={username}>{children}</Shell>;
}
