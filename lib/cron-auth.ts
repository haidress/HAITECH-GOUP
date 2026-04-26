import { NextResponse } from "next/server";

export function verifyCronRequest(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "CRON_SECRET manquant : configurez un secret fort en production." },
      { status: 503 }
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }
  return null;
}
