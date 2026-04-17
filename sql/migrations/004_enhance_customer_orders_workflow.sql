ALTER TABLE customer_orders
  ADD COLUMN IF NOT EXISTS reference_code VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS assigned_user_id BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS handled_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS last_status_at DATETIME NULL;

ALTER TABLE customer_orders
  ADD UNIQUE KEY uk_customer_orders_reference_code (reference_code);

ALTER TABLE customer_orders
  ADD KEY idx_customer_orders_assigned_user_id (assigned_user_id);

ALTER TABLE customer_orders
  ADD CONSTRAINT fk_customer_orders_assigned_user
  FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS order_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  note TEXT NOT NULL,
  action_type ENUM('comment', 'status_change', 'assignment') NOT NULL DEFAULT 'comment',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_notes_order_id (order_id),
  CONSTRAINT fk_order_notes_order FOREIGN KEY (order_id) REFERENCES customer_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_notes_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
