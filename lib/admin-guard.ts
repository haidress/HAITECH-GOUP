import { BACKOFFICE_ROLES, getCurrentUser, type UserRole } from "@/lib/auth";

export async function isAdminAuthenticated() {
  const user = await getCurrentUser();
  return Boolean(user && BACKOFFICE_ROLES.includes(user.role as UserRole));
}

export async function hasAnyRole(roles: Array<"admin" | "client" | "etudiant" | "technicien" | "catalog_manager" | "sales_manager" | "super_admin">) {
  const user = await getCurrentUser();
  return Boolean(user && roles.includes(user.role as "admin" | "client" | "etudiant" | "technicien" | "catalog_manager" | "sales_manager" | "super_admin"));
}
