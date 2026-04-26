-- Ajoute les rôles métiers pour la gouvernance admin

INSERT IGNORE INTO roles (nom) VALUES
  ('catalog_manager'),
  ('sales_manager'),
  ('super_admin');
