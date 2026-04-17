import { requireRole } from "@/lib/auth";

export default async function EspaceClientLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole(["client", "admin"]);
  return <>{children}</>;
}
