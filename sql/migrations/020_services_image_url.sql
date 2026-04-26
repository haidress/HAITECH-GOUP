-- Image vitrine pour les offres catalogue (services / admin catalogue)
ALTER TABLE services
  ADD COLUMN image_url VARCHAR(512) NULL AFTER prix_initial;
