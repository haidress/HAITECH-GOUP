CREATE TABLE IF NOT EXISTS customer_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_type ENUM('business_center', 'boutique_it', 'formation') NOT NULL,
  product_name VARCHAR(190) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  nom VARCHAR(120) NOT NULL,
  contact VARCHAR(40) NOT NULL,
  email VARCHAR(190) NOT NULL,
  status ENUM('nouvelle', 'en_cours', 'traitee', 'annulee') NOT NULL DEFAULT 'nouvelle',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_customer_orders_status (status),
  KEY idx_customer_orders_created_at (created_at),
  KEY idx_customer_orders_source_type (source_type)
);
