import { getCurrentUser } from "@/lib/auth";

export type Permission =
  | "orders.close"
  | "orders.update"
  | "maintenance.schedule"
  | "maintenance.update"
  | "exports.download"
  | "incidents.manage"
  | "catalog.manage"
  | "catalog.pricing"
  | "catalog.stock"
  | "catalog.publish";

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    "orders.close",
    "orders.update",
    "maintenance.schedule",
    "maintenance.update",
    "exports.download",
    "incidents.manage",
    "catalog.manage",
    "catalog.pricing",
    "catalog.stock",
    "catalog.publish"
  ],
  super_admin: [
    "orders.close",
    "orders.update",
    "maintenance.schedule",
    "maintenance.update",
    "exports.download",
    "incidents.manage",
    "catalog.manage",
    "catalog.pricing",
    "catalog.stock",
    "catalog.publish"
  ],
  catalog_manager: ["catalog.manage", "catalog.publish"],
  sales_manager: ["orders.update", "catalog.pricing"],
  client: [],
  etudiant: [],
  technicien: []
};

export async function hasPermission(permission: Permission) {
  const user = await getCurrentUser();
  if (!user) return false;
  return (rolePermissions[user.role] ?? []).includes(permission);
}
