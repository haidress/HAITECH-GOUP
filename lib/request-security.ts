import { NextResponse } from "next/server";

export function ensureSameOrigin(request: Request) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const host = request.headers.get("host");
  if (!host) {
    return NextResponse.json({ success: false, message: "Origine requête invalide." }, { status: 403 });
  }

  const expectedOrigin = `${new URL(request.url).protocol}//${host}`;
  if (origin) {
    if (origin !== expectedOrigin) {
      return NextResponse.json({ success: false, message: "CSRF bloqué (origin mismatch)." }, { status: 403 });
    }
    return null;
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== expectedOrigin) {
        return NextResponse.json({ success: false, message: "CSRF bloqué (referer mismatch)." }, { status: 403 });
      }
      return null;
    } catch {
      return NextResponse.json({ success: false, message: "Referer invalide." }, { status: 403 });
    }
  }

  return NextResponse.json({ success: false, message: "Origine requête invalide." }, { status: 403 });
}
