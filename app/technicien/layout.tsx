import { requireRole } from "@/lib/auth";

export default async function TechnicienLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole(["technicien", "admin"]);
  return <>{children}</>;
}
