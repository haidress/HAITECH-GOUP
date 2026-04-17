import { getDbPool } from "@/lib/db";

export async function upsertOrderClosureChecklist({
  orderId,
  actorUserId,
  clientValidationOk,
  reportSentOk,
  proofAttachedOk,
  proofUrl,
  closureNote
}: {
  orderId: number;
  actorUserId?: number | null;
  clientValidationOk: boolean;
  reportSentOk: boolean;
  proofAttachedOk: boolean;
  proofUrl?: string | null;
  closureNote?: string | null;
}) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO order_closure_checklists (
      order_id, client_validation_ok, report_sent_ok, proof_attached_ok, proof_url, closure_note, created_by_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      client_validation_ok = VALUES(client_validation_ok),
      report_sent_ok = VALUES(report_sent_ok),
      proof_attached_ok = VALUES(proof_attached_ok),
      proof_url = VALUES(proof_url),
      closure_note = VALUES(closure_note),
      created_by_user_id = VALUES(created_by_user_id)
    `,
    [orderId, clientValidationOk, reportSentOk, proofAttachedOk, proofUrl ?? null, closureNote ?? null, actorUserId ?? null]
  );
}
