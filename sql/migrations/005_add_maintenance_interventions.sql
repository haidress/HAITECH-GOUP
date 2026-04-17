CREATE TABLE IF NOT EXISTS maintenance_interventions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  titre VARCHAR(180) NOT NULL,
  details TEXT NULL,
  intervention_type ENUM('preventive', 'corrective', 'installation', 'audit') NOT NULL DEFAULT 'preventive',
  statut ENUM('planifiee', 'en_cours', 'terminee', 'reportee') NOT NULL DEFAULT 'planifiee',
  scheduled_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_maintenance_client_id (client_id),
  KEY idx_maintenance_scheduled_at (scheduled_at),
  CONSTRAINT fk_maintenance_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
