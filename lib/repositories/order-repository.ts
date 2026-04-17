import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export async function getOrderById(id: number) {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, status, assigned_user_id, reference_code, email, product_name, is_closed
    FROM customer_orders
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );
  return rows[0] as
    | {
        id: number;
        status: string;
        assigned_user_id: number | null;
        reference_code: string;
        email: string;
        product_name: string;
        is_closed: number;
      }
    | undefined;
}
