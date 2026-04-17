ALTER TABLE customer_orders
  MODIFY status ENUM('nouvelle', 'en_cours', 'en_attente_client', 'validee_client', 'livree', 'traitee', 'cloturee', 'annulee') NOT NULL DEFAULT 'nouvelle';

CREATE TABLE IF NOT EXISTS order_closure_checklists (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  client_validation_ok BOOLEAN NOT NULL DEFAULT FALSE,
  report_sent_ok BOOLEAN NOT NULL DEFAULT FALSE,
  proof_attached_ok BOOLEAN NOT NULL DEFAULT FALSE,
  proof_url VARCHAR(255) NULL,
  closure_note TEXT NULL,
  created_by_user_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_order_closure_checklist_order_id (order_id),
  CONSTRAINT fk_order_closure_checklist_order FOREIGN KEY (order_id) REFERENCES customer_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_closure_checklist_user FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS client_contracts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  contract_name VARCHAR(180) NOT NULL,
  sla_hours INT UNSIGNED NOT NULL DEFAULT 48,
  plan_type ENUM('maintenance', 'support', 'infogerance', 'projet') NOT NULL DEFAULT 'maintenance',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('actif', 'expire', 'resilie') NOT NULL DEFAULT 'actif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_client_contracts_client_id (client_id),
  CONSTRAINT fk_client_contracts_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_plan_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  contract_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  frequency_days INT UNSIGNED NOT NULL DEFAULT 30,
  next_run_at DATETIME NOT NULL,
  status ENUM('planifie', 'fait', 'en_retard') NOT NULL DEFAULT 'planifie',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_maintenance_plan_items_contract_id (contract_id),
  KEY idx_maintenance_plan_items_next_run_at (next_run_at),
  CONSTRAINT fk_maintenance_plan_items_contract FOREIGN KEY (contract_id) REFERENCES client_contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS incident_tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  created_by_user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('basse', 'moyenne', 'haute', 'critique') NOT NULL DEFAULT 'moyenne',
  status ENUM('ouvert', 'en_cours', 'en_attente_client', 'resolu', 'ferme') NOT NULL DEFAULT 'ouvert',
  escalation_level INT UNSIGNED NOT NULL DEFAULT 0,
  assigned_user_id BIGINT UNSIGNED NULL,
  due_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_incident_tickets_client_id (client_id),
  KEY idx_incident_tickets_status (status),
  KEY idx_incident_tickets_priority (priority),
  CONSTRAINT fk_incident_tickets_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  CONSTRAINT fk_incident_tickets_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_incident_tickets_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS incident_comments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT UNSIGNED NOT NULL,
  author_user_id BIGINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_incident_comments_ticket_id (ticket_id),
  CONSTRAINT fk_incident_comments_ticket FOREIGN KEY (ticket_id) REFERENCES incident_tickets(id) ON DELETE CASCADE,
  CONSTRAINT fk_incident_comments_author FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS client_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  doc_type ENUM('bon_intervention', 'rapport_pdf', 'pv_recette', 'devis', 'facture', 'autre') NOT NULL DEFAULT 'autre',
  file_url VARCHAR(255) NOT NULL,
  visible_to_client BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_client_documents_client_id (client_id),
  CONSTRAINT fk_client_documents_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  CONSTRAINT fk_client_documents_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notification_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  channel ENUM('email', 'whatsapp', 'in_app') NOT NULL,
  event_type VARCHAR(120) NOT NULL,
  payload_json TEXT NULL,
  status ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notification_events_user_id (user_id),
  CONSTRAINT fk_notification_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  role_target ENUM('client', 'etudiant') NOT NULL,
  primary_goal VARCHAR(180) NULL,
  company_size VARCHAR(80) NULL,
  onboarding_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_onboarding_profiles_user_id (user_id),
  CONSTRAINT fk_onboarding_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nps_feedback (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  score TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_nps_feedback_client_id (client_id),
  CONSTRAINT fk_nps_feedback_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(160) NOT NULL,
  resource_type VARCHAR(80) NOT NULL,
  resource_id VARCHAR(80) NULL,
  before_json TEXT NULL,
  after_json TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_actor_user_id (actor_user_id),
  KEY idx_audit_logs_resource_type (resource_type),
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
