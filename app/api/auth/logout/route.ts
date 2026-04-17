import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, SESSION_COOKIE } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      path: "/",
      maxAge: 0
    });
    return response;
  } catch (error) {
    console.error("Erreur logout:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
