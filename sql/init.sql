CREATE DATABASE IF NOT EXISTS haitech_group
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE haitech_group;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(120) NOT NULL,
  prenom VARCHAR(120) NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  telephone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verifie BOOLEAN NOT NULL DEFAULT FALSE,
  role_id BIGINT UNSIGNED NOT NULL,
  statut ENUM('actif', 'suspendu') NOT NULL DEFAULT 'actif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_users_role_id (role_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(190) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_email_verifications_email (email),
  CONSTRAINT fk_email_verifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  date_expiration DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sessions_user_id (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  telephone VARCHAR(30) NULL,
  source ENUM('site', 'whatsapp', 'autre') NOT NULL DEFAULT 'site',
  besoin TEXT NOT NULL,
  budget DECIMAL(12, 2) NULL,
  statut ENUM('nouveau', 'qualifie', 'converti', 'perdu') NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leads_created_at (created_at),
  KEY idx_leads_statut (statut),
  KEY idx_leads_email (email)
);

CREATE TABLE IF NOT EXISTS clients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  entreprise VARCHAR(180) NULL,
  adresse VARCHAR(255) NULL,
  type_client ENUM('particulier', 'entreprise') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_clients_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(140) NOT NULL,
  description TEXT NULL,
  categorie ENUM('Technology', 'Academy', 'Business Center', 'Boutique IT') NOT NULL,
  prix_base DECIMAL(12, 2) NOT NULL DEFAULT 0,
  prix_initial DECIMAL(12, 2) NULL,
  image_url VARCHAR(512) NULL,
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  KEY idx_services_categorie (categorie)
);

CREATE TABLE IF NOT EXISTS devis (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NULL,
  lead_id BIGINT UNSIGNED NULL,
  montant_ht DECIMAL(12, 2) NOT NULL DEFAULT 0,
  remise_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
  tva_percent DECIMAL(5, 2) NOT NULL DEFAULT 18,
  montant_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  statut ENUM('brouillon', 'envoye', 'accepte', 'refuse') NOT NULL DEFAULT 'brouillon',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_devis_client_id (client_id),
  KEY idx_devis_lead_id (lead_id),
  CONSTRAINT fk_devis_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  CONSTRAINT fk_devis_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS devis_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  devis_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  quantite INT UNSIGNED NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(12, 2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_devis_items_devis_id (devis_id),
  KEY idx_devis_items_service_id (service_id),
  CONSTRAINT fk_devis_items_devis FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE,
  CONSTRAINT fk_devis_items_service FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS formations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  titre VARCHAR(180) NOT NULL,
  description TEXT NULL,
  prix DECIMAL(12, 2) NOT NULL DEFAULT 0,
  niveau VARCHAR(80) NULL,
  duree VARCHAR(80) NULL,
  image VARCHAR(255) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS modules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formation_id BIGINT UNSIGNED NOT NULL,
  titre VARCHAR(180) NOT NULL,
  ordre INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_modules_formation_id (formation_id),
  CONSTRAINT fk_modules_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  module_id BIGINT UNSIGNED NOT NULL,
  titre VARCHAR(180) NOT NULL,
  contenu LONGTEXT NULL,
  type ENUM('video', 'pdf', 'quiz') NOT NULL,
  PRIMARY KEY (id),
  KEY idx_lecons_module_id (module_id),
  CONSTRAINT fk_lecons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  formation_id BIGINT UNSIGNED NOT NULL,
  progression DECIMAL(5, 2) NOT NULL DEFAULT 0,
  statut ENUM('active', 'terminee', 'annulee') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id),
  UNIQUE KEY uk_inscriptions_user_formation (user_id, formation_id),
  KEY idx_inscriptions_formation_id (formation_id),
  CONSTRAINT fk_inscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_inscriptions_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificats (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  formation_id BIGINT UNSIGNED NOT NULL,
  url_certificat VARCHAR(255) NOT NULL,
  date_generation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_certificats_user_id (user_id),
  KEY idx_certificats_formation_id (formation_id),
  CONSTRAINT fk_certificats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_certificats_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  titre VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  contenu LONGTEXT NOT NULL,
  image VARCHAR(255) NULL,
  auteur_id BIGINT UNSIGNED NOT NULL,
  statut ENUM('publie', 'brouillon') NOT NULL DEFAULT 'brouillon',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_articles_auteur_id (auteur_id),
  CONSTRAINT fk_articles_auteur FOREIGN KEY (auteur_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(120) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS article_categories (
  article_id BIGINT UNSIGNED NOT NULL,
  categorie_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (article_id, categorie_id),
  KEY idx_article_categories_categorie_id (categorie_id),
  CONSTRAINT fk_article_categories_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_article_categories_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  description TEXT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_logs_user_id (user_id),
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT FALSE,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user_id (user_id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cle VARCHAR(120) NOT NULL UNIQUE,
  valeur TEXT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS payment_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  source_type ENUM('business_center', 'boutique_it', 'formation', 'services_it') NOT NULL,
  product_name VARCHAR(190) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'XOF',
  payment_method ENUM('wave', 'orange_money') NOT NULL,
  status ENUM('initiated', 'paid', 'failed') NOT NULL DEFAULT 'initiated',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payment_orders_user_id (user_id),
  KEY idx_payment_orders_status (status),
  CONSTRAINT fk_payment_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customer_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference_code VARCHAR(50) NULL,
  source_type ENUM('business_center', 'boutique_it', 'formation', 'services_it') NOT NULL,
  product_name VARCHAR(190) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  nom VARCHAR(120) NOT NULL,
  contact VARCHAR(40) NOT NULL,
  email VARCHAR(190) NOT NULL,
  status ENUM('nouvelle', 'en_cours', 'traitee', 'annulee') NOT NULL DEFAULT 'nouvelle',
  assigned_user_id BIGINT UNSIGNED NULL,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  closed_at DATETIME NULL,
  closed_by_user_id BIGINT UNSIGNED NULL,
  handled_at DATETIME NULL,
  last_status_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_customer_orders_reference_code (reference_code),
  KEY idx_customer_orders_status (status),
  KEY idx_customer_orders_created_at (created_at),
  KEY idx_customer_orders_source_type (source_type),
  KEY idx_customer_orders_assigned_user_id (assigned_user_id),
  KEY idx_customer_orders_is_closed (is_closed),
  CONSTRAINT fk_customer_orders_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_customer_orders_closed_by_user FOREIGN KEY (closed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  note TEXT NOT NULL,
  action_type ENUM('comment', 'status_change', 'assignment') NOT NULL DEFAULT 'comment',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_notes_order_id (order_id),
  CONSTRAINT fk_order_notes_order FOREIGN KEY (order_id) REFERENCES customer_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_notes_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

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

CREATE TABLE IF NOT EXISTS realisation_projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(140) NOT NULL,
  title VARCHAR(220) NOT NULL,
  tag ENUM('Web', 'IT', 'Formation', 'Business') NOT NULL DEFAULT 'Business',
  client_name VARCHAR(180) NOT NULL,
  sector VARCHAR(180) NOT NULL,
  context_text TEXT NOT NULL,
  challenge_text TEXT NOT NULL,
  solution_text TEXT NOT NULL,
  outcome_text TEXT NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  year_label VARCHAR(40) NOT NULL,
  duration_label VARCHAR(120) NOT NULL,
  stack_json JSON NULL,
  highlights_json JSON NULL,
  detail_notes_json JSON NULL,
  links_json JSON NULL,
  image_url VARCHAR(600) NOT NULL,
  image_fit ENUM('cover', 'contain') NOT NULL DEFAULT 'cover',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_realisation_projects_slug (slug),
  KEY idx_realisation_projects_published (is_published),
  KEY idx_realisation_projects_sort_order (sort_order),
  KEY idx_realisation_projects_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cron_execution_locks (
  lock_key VARCHAR(120) NOT NULL,
  owner_token VARCHAR(120) NOT NULL,
  expires_at DATETIME NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (lock_key),
  KEY idx_cron_lock_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lead_followup_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id BIGINT UNSIGNED NOT NULL,
  followup_type ENUM('j2_email') NOT NULL,
  status ENUM('claimed', 'sent', 'skipped', 'error') NOT NULL DEFAULT 'claimed',
  details_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lead_followup_once (lead_id, followup_type),
  KEY idx_lead_followup_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO roles (nom)
VALUES ('admin'), ('client'), ('etudiant')
ON DUPLICATE KEY UPDATE nom = VALUES(nom);

INSERT INTO users (nom, prenom, email, telephone, password_hash, role_id, statut)
SELECT
  'HAITECH',
  'Admin',
  'admin@haitech-group.ci',
  '0789174619',
  '$2b$10$qRoTMisrwIcnsQzKeQ48N.J1SnqUZGjbxI1B84LzCPYyOh3K8fMxS',
  r.id,
  'actif'
FROM roles r
WHERE r.nom = 'admin'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@haitech-group.ci');

INSERT INTO users (nom, prenom, email, telephone, password_hash, role_id, statut)
SELECT
  'Client',
  'Demo',
  'client@haitech-group.ci',
  '0101010101',
  '$2b$10$qRoTMisrwIcnsQzKeQ48N.J1SnqUZGjbxI1B84LzCPYyOh3K8fMxS',
  r.id,
  'actif'
FROM roles r
WHERE r.nom = 'client'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@haitech-group.ci');

INSERT INTO users (nom, prenom, email, telephone, password_hash, role_id, statut)
SELECT
  'Etudiant',
  'Demo',
  'etudiant@haitech-group.ci',
  '0202020202',
  '$2b$10$qRoTMisrwIcnsQzKeQ48N.J1SnqUZGjbxI1B84LzCPYyOh3K8fMxS',
  r.id,
  'actif'
FROM roles r
WHERE r.nom = 'etudiant'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'etudiant@haitech-group.ci');

INSERT INTO services (nom, description, categorie, prix_base, actif)
VALUES
  ('Création site vitrine', 'Conception site moderne et responsive', 'Technology', 350000, TRUE),
  ('Automatisation commerciale', 'Mise en place tunnel et CRM', 'Business Center', 500000, TRUE),
  ('Formation Marketing Digital', 'Programme certifiant de 4 semaines', 'Academy', 120000, TRUE)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  categorie = VALUES(categorie),
  prix_base = VALUES(prix_base),
  actif = VALUES(actif);

ALTER TABLE devis ADD COLUMN IF NOT EXISTS montant_ht DECIMAL(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE devis ADD COLUMN IF NOT EXISTS remise_percent DECIMAL(5, 2) NOT NULL DEFAULT 0;
ALTER TABLE devis ADD COLUMN IF NOT EXISTS tva_percent DECIMAL(5, 2) NOT NULL DEFAULT 18;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verifie BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE users
SET email_verifie = TRUE
WHERE email IN ('admin@haitech-group.ci', 'client@haitech-group.ci', 'etudiant@haitech-group.ci');

