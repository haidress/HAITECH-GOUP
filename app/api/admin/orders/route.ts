import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const validStatuses = ["nouvelle", "en_cours", "en_attente_client", "validee_client", "livree", "traitee", "cloturee", "annulee"] as const;
    const requestUrl = new URL(request.url);
    const searchParams = requestUrl.searchParams;
    const closed = searchParams.get("closed");
    const status = searchParams.get("status");
    const assignedUserIdRaw = searchParams.get("assignedUserId");
    const periodFrom = searchParams.get("from");
    const periodTo = searchParams.get("to");

    const conditions: string[] = [];
    const values: Array<string | number> = [];
    if (status && validStatuses.includes(status as (typeof validStatuses)[number])) {
      conditions.push("o.status = ?");
      values.push(status);
    }

    if (assignedUserIdRaw) {
      const assignedUserId = Number(assignedUserIdRaw);
      if (Number.isFinite(assignedUserId) && assignedUserId > 0) {
        conditions.push("o.assigned_user_id = ?");
        values.push(assignedUserId);
      }
    }

    if (periodFrom) {
      conditions.push("DATE(o.created_at) >= ?");
      values.push(periodFrom);
    }
    if (periodTo) {
      conditions.push("DATE(o.created_at) <= ?");
      values.push(periodTo);
    }
    if (closed === "1") conditions.push("o.is_closed = 1");
    if (closed === "0") conditions.push("o.is_closed = 0");

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        o.id,
        o.reference_code,
        o.source_type,
        o.product_name,
        o.amount,
        o.nom,
        o.contact,
        o.email,
        o.status,
        o.assigned_user_id,
        o.is_closed,
        o.closed_at,
        CONCAT(COALESCE(u.nom, ''), ' ', COALESCE(u.prenom, '')) AS assigned_user_name,
        o.created_at,
        o.last_status_at,
        (
          SELECT n.note
          FROM order_notes n
          WHERE n.order_id = o.id
          ORDER BY n.created_at DESC
          LIMIT 1
        ) AS latest_note
      FROM customer_orders o
      LEFT JOIN users u ON u.id = o.assigned_user_id
      ${whereClause}
      ORDER BY created_at DESC
      `,
      values
    );

    const [admins] = await pool.query<RowDataPacket[]>(
      `
      SELECT u.id, u.nom, u.prenom, u.email
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE r.nom = 'admin' AND u.statut = 'actif'
      ORDER BY u.nom ASC
      `
    );

    return NextResponse.json({
      success: true,
      data: rows,
      admins,
      filters: {
        status: status ?? "",
        assignedUserId: assignedUserIdRaw ?? "",
        from: periodFrom ?? "",
        to: periodTo ?? "",
        closed: closed ?? ""
      }
    });
  } catch (error) {
    console.error("Erreur GET /api/admin/orders:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const user = await getCurrentUser();
    const payload = (await request.json()) as { orderId?: number };
    const orderId = Number(payload.orderId ?? 0);
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json({ success: false, message: "Identifiant commande invalide." }, { status: 400 });
    }

    const pool = getDbPool();
    const [notes] = await pool.query<RowDataPacket[]>(
      `
      SELECT n.id, n.note, n.action_type, n.created_at,
             CONCAT(COALESCE(u.nom, ''), ' ', COALESCE(u.prenom, '')) AS actor_name
      FROM order_notes n
      LEFT JOIN users u ON u.id = n.actor_user_id
      WHERE n.order_id = ?
      ORDER BY n.created_at DESC
      `,
      [orderId]
    );

    if (!notes.length) {
      await pool.execute(
        `INSERT INTO order_notes (order_id, actor_user_id, note, action_type) VALUES (?, ?, ?, 'comment')`,
        [orderId, user?.id ?? null, "Commande créée et en attente de traitement."]
      );
      const [refreshed] = await pool.query<RowDataPacket[]>(
        `
        SELECT n.id, n.note, n.action_type, n.created_at,
               CONCAT(COALESCE(u.nom, ''), ' ', COALESCE(u.prenom, '')) AS actor_name
        FROM order_notes n
        LEFT JOIN users u ON u.id = n.actor_user_id
        WHERE n.order_id = ?
        ORDER BY n.created_at DESC
        `,
        [orderId]
      );
      return NextResponse.json({ success: true, data: refreshed });
    }

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("Erreur POST /api/admin/orders:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
