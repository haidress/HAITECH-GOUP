import { getCurrentUser } from "@/lib/auth";

export type Permission =
  | "orders.close"
  | "orders.update"
  | "maintenance.schedule"
  | "maintenance.update"
  | "exports.download"
  | "incidents.manage";

const rolePermissions: Record<string, Permission[]> = {
  admin: ["orders.close", "orders.update", "maintenance.schedule", "maintenance.update", "exports.download", "incidents.manage"],
  client: [],
  etudiant: []
};

export async function hasPermission(permission: Permission) {
  const user = await getCurrentUser();
  if (!user) return false;
  return (rolePermissions[user.role] ?? []).includes(permission);
}
