import { getCurrentUser } from "@/lib/auth";

export async function isAdminAuthenticated() {
  const user = await getCurrentUser();
  return Boolean(user && user.role === "admin");
}

export async function hasAnyRole(roles: Array<"admin" | "client" | "etudiant" | "technicien">) {
  const user = await getCurrentUser();
  return Boolean(user && roles.includes(user.role as "admin" | "client" | "etudiant" | "technicien"));
}
