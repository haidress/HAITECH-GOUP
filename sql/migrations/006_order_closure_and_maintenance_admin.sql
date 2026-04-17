ALTER TABLE customer_orders
  ADD COLUMN is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN closed_at DATETIME NULL,
  ADD COLUMN closed_by_user_id BIGINT UNSIGNED NULL,
  ADD KEY idx_customer_orders_is_closed (is_closed),
  ADD CONSTRAINT fk_customer_orders_closed_by_user FOREIGN KEY (closed_by_user_id) REFERENCES users(id) ON DELETE SET NULL;
