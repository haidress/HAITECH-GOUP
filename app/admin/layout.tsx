import { requireBackofficeUser } from "@/lib/auth";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireBackofficeUser();
  return <>{children}</>;
}
