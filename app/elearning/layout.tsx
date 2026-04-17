import { requireRole } from "@/lib/auth";

export default async function ElearningLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole(["etudiant", "admin"]);
  return <>{children}</>;
}
