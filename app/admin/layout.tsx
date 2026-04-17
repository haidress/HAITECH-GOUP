import { requireAdminUser } from "@/lib/auth";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminUser();
  return <>{children}</>;
}
