-- Suite e-commerce Boutique IT (stock, variantes, avis, SEO, coupons, bundles, audit)

CREATE TABLE IF NOT EXISTS boutique_products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  service_id BIGINT UNSIGNED NULL,
  slug VARCHAR(220) NOT NULL,
  name VARCHAR(190) NOT NULL,
  short_description TEXT NULL,
  long_description MEDIUMTEXT NULL,
  category VARCHAR(120) NOT NULL,
  brand VARCHAR(120) NULL,
  product_condition ENUM('neuf', 'reconditionne') NOT NULL DEFAULT 'neuf',
  image_url VARCHAR(500) NULL,
  gallery_json JSON NULL,
  base_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  initial_price DECIMAL(12,2) NULL,
  promo_price DECIMAL(12,2) NULL,
  promo_start_at DATETIME NULL,
  promo_end_at DATETIME NULL,
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  allow_backorder TINYINT(1) NOT NULL DEFAULT 0,
  warranty_months INT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  views_count INT NOT NULL DEFAULT 0,
  sales_count INT NOT NULL DEFAULT 0,
  seo_title VARCHAR(220) NULL,
  seo_description VARCHAR(320) NULL,
  canonical_url VARCHAR(500) NULL,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_boutique_products_slug (slug),
  KEY idx_boutique_products_category (category),
  KEY idx_boutique_products_published (is_published),
  KEY idx_boutique_products_stock (stock),
  KEY idx_boutique_products_brand (brand)
);

CREATE TABLE IF NOT EXISTS boutique_product_variants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(120) NOT NULL,
  name VARCHAR(190) NOT NULL,
  attributes_json JSON NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  initial_price DECIMAL(12,2) NULL,
  promo_price DECIMAL(12,2) NULL,
  promo_start_at DATETIME NULL,
  promo_end_at DATETIME NULL,
  stock INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_boutique_variants_sku (sku),
  KEY idx_boutique_variants_product (product_id),
  CONSTRAINT fk_boutique_variants_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_product_specs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  spec_key VARCHAR(120) NOT NULL,
  spec_value VARCHAR(320) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_boutique_specs_product (product_id),
  CONSTRAINT fk_boutique_specs_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_product_faqs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  question VARCHAR(320) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_boutique_faqs_product (product_id),
  CONSTRAINT fk_boutique_faqs_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_product_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  author_name VARCHAR(140) NOT NULL,
  author_email VARCHAR(190) NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_boutique_reviews_product (product_id),
  KEY idx_boutique_reviews_approved (is_approved),
  CONSTRAINT fk_boutique_reviews_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_price_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  old_base_price DECIMAL(12,2) NULL,
  new_base_price DECIMAL(12,2) NULL,
  old_initial_price DECIMAL(12,2) NULL,
  new_initial_price DECIMAL(12,2) NULL,
  old_promo_price DECIMAL(12,2) NULL,
  new_promo_price DECIMAL(12,2) NULL,
  changed_by BIGINT UNSIGNED NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_boutique_price_history_product (product_id),
  CONSTRAINT fk_boutique_price_history_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_admin_audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL,
  action_type VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  payload_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_boutique_audit_actor (actor_user_id),
  KEY idx_boutique_audit_entity (entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS boutique_coupons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL,
  discount_type ENUM('fixed','percent') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  max_uses INT NULL,
  uses_count INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_boutique_coupon_code (code)
);

CREATE TABLE IF NOT EXISTS boutique_bundles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(190) NOT NULL,
  description TEXT NULL,
  discount_type ENUM('fixed','percent') NOT NULL DEFAULT 'percent',
  discount_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS boutique_bundle_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  bundle_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_boutique_bundle_items_bundle (bundle_id),
  KEY idx_boutique_bundle_items_product (product_id),
  CONSTRAINT fk_boutique_bundle_items_bundle FOREIGN KEY (bundle_id) REFERENCES boutique_bundles(id) ON DELETE CASCADE,
  CONSTRAINT fk_boutique_bundle_items_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_wishlist_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  session_token VARCHAR(120) NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_boutique_wishlist_user (user_id),
  KEY idx_boutique_wishlist_session (session_token),
  KEY idx_boutique_wishlist_product (product_id),
  CONSTRAINT fk_boutique_wishlist_product FOREIGN KEY (product_id) REFERENCES boutique_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boutique_abandoned_carts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_token VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL,
  payload_json JSON NOT NULL,
  last_activity_at DATETIME NOT NULL,
  recovered_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_boutique_abandoned_session (session_token),
  KEY idx_boutique_abandoned_email (email)
);
