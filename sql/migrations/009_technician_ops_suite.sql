INSERT INTO roles (nom) VALUES ('technicien')
ON DUPLICATE KEY UPDATE nom = VALUES(nom);

CREATE TABLE IF NOT EXISTS technician_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  niveau ENUM('N1', 'N2', 'terrain') NOT NULL DEFAULT 'terrain',
  specialites VARCHAR(255) NULL,
  disponibilite ENUM('disponible', 'occupe', 'off') NOT NULL DEFAULT 'disponible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_technician_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE incident_tickets
  ADD COLUMN assigned_technician_user_id BIGINT UNSIGNED NULL,
  ADD COLUMN eta_at DATETIME NULL,
  ADD CONSTRAINT fk_incident_assigned_technician FOREIGN KEY (assigned_technician_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE maintenance_interventions
  ADD COLUMN assigned_technician_user_id BIGINT UNSIGNED NULL,
  ADD COLUMN eta_at DATETIME NULL,
  ADD COLUMN checkin_at DATETIME NULL,
  ADD COLUMN checkout_at DATETIME NULL,
  ADD COLUMN labor_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN labor_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN intervention_summary TEXT NULL,
  ADD CONSTRAINT fk_maintenance_assigned_technician FOREIGN KEY (assigned_technician_user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS intervention_checklists (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  intervention_id BIGINT UNSIGNED NOT NULL UNIQUE,
  arrived_ok BOOLEAN NOT NULL DEFAULT FALSE,
  diagnostic_ok BOOLEAN NOT NULL DEFAULT FALSE,
  action_done_ok BOOLEAN NOT NULL DEFAULT FALSE,
  client_test_ok BOOLEAN NOT NULL DEFAULT FALSE,
  client_signature_name VARCHAR(180) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_intervention_checklists_intervention FOREIGN KEY (intervention_id) REFERENCES maintenance_interventions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS intervention_parts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  intervention_id BIGINT UNSIGNED NOT NULL,
  part_name VARCHAR(180) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_intervention_parts_intervention_id (intervention_id),
  CONSTRAINT fk_intervention_parts_intervention FOREIGN KEY (intervention_id) REFERENCES maintenance_interventions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS intervention_photos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  intervention_id BIGINT UNSIGNED NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  caption VARCHAR(180) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_intervention_photos_intervention_id (intervention_id),
  CONSTRAINT fk_intervention_photos_intervention FOREIGN KEY (intervention_id) REFERENCES maintenance_interventions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS machine_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  asset_name VARCHAR(180) NOT NULL,
  os_version VARCHAR(120) NULL,
  serial_number VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_machine_assets_client_id (client_id),
  CONSTRAINT fk_machine_assets_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
