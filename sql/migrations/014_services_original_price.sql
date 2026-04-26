-- Ajoute le prix initial pour gérer les promos réelles côté admin

ALTER TABLE services
ADD COLUMN IF NOT EXISTS prix_initial DECIMAL(12, 2) NULL AFTER prix_base;

