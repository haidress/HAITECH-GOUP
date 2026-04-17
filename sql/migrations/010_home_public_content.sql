-- Contenu d’accueil piloté par l’admin (bandeau actu, variantes CTA, date de fraîcheur)

CREATE TABLE IF NOT EXISTS home_public_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
  announcement_title VARCHAR(200) NULL,
  announcement_body VARCHAR(2000) NULL,
  announcement_cta_label VARCHAR(120) NULL,
  announcement_cta_href VARCHAR(600) NULL,
  announcement_visible TINYINT(1) NOT NULL DEFAULT 0,
  hero_cta_primary_label VARCHAR(120) NOT NULL DEFAULT 'Demander un devis',
  hero_cta_primary_label_b VARCHAR(120) NOT NULL DEFAULT 'Obtenir une proposition',
  home_experiment_variant CHAR(1) NOT NULL DEFAULT 'A',
  last_site_update_label VARCHAR(160) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO home_public_content (id, announcement_visible, hero_cta_primary_label, hero_cta_primary_label_b, home_experiment_variant)
VALUES (1, 0, 'Demander un devis', 'Obtenir une proposition', 'A')
ON DUPLICATE KEY UPDATE id = id;
