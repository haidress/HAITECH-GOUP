-- Stock admin pour les références du catalogue vitrine (IDs produits page /boutique-it)

CREATE TABLE IF NOT EXISTS boutique_reference_stock (
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id),
  KEY idx_boutique_reference_stock_quantity (quantity)
);
