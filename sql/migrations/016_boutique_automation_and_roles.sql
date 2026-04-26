-- Rôles fins + logs de relance automatique

CREATE TABLE IF NOT EXISTS role_permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(80) NOT NULL,
  permission_key VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_permission (role_name, permission_key)
);

INSERT IGNORE INTO role_permissions (role_name, permission_key) VALUES
  ('admin', 'catalog.manage'),
  ('admin', 'catalog.pricing'),
  ('admin', 'catalog.stock'),
  ('admin', 'catalog.publish'),
  ('admin', 'orders.update'),
  ('admin', 'orders.close'),
  ('admin', 'exports.download'),
  ('catalog_manager', 'catalog.manage'),
  ('catalog_manager', 'catalog.publish'),
  ('sales_manager', 'catalog.pricing'),
  ('sales_manager', 'orders.update'),
  ('super_admin', 'catalog.manage'),
  ('super_admin', 'catalog.pricing'),
  ('super_admin', 'catalog.stock'),
  ('super_admin', 'catalog.publish'),
  ('super_admin', 'orders.update'),
  ('super_admin', 'orders.close'),
  ('super_admin', 'exports.download');

CREATE TABLE IF NOT EXISTS order_followup_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  day_mark TINYINT UNSIGNED NOT NULL,
  channel ENUM('email', 'whatsapp') NOT NULL,
  status ENUM('sent', 'skipped', 'error') NOT NULL DEFAULT 'sent',
  details_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_followup_once (order_id, day_mark, channel),
  KEY idx_order_followup_order (order_id)
);
