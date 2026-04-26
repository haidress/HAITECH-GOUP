-- Leads CRM : affectation, suivi relances, horodatage
ALTER TABLE leads
  ADD COLUMN assigned_user_id BIGINT UNSIGNED NULL AFTER statut,
  ADD COLUMN last_followup_email_at TIMESTAMP NULL DEFAULT NULL,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY idx_leads_assigned_user_id (assigned_user_id),
  ADD CONSTRAINT fk_leads_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_leads_followup_queue ON leads (statut, created_at, last_followup_email_at);

-- SEO par chemin de page (sans redéploiement)
CREATE TABLE IF NOT EXISTS site_page_seo (
  path VARCHAR(190) NOT NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(500) NOT NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(500) NULL,
  og_image_path VARCHAR(255) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (path)
);

-- Durée de conservation des leads (jours) — purge via cron sécurisé
INSERT INTO settings (cle, valeur)
SELECT 'leads_retention_days', '730'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE cle = 'leads_retention_days' LIMIT 1);
