ALTER TABLE incident_tickets
  ADD COLUMN asset_name VARCHAR(180) NULL,
  ADD COLUMN os_version VARCHAR(120) NULL,
  ADD COLUMN remote_possible BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN remote_tool VARCHAR(80) NULL,
  ADD COLUMN remote_session_link VARCHAR(255) NULL,
  ADD COLUMN onsite_required BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN onsite_address VARCHAR(255) NULL,
  ADD COLUMN onsite_scheduled_at DATETIME NULL,
  ADD COLUMN resolution_mode ENUM('pending', 'remote', 'onsite', 'hybrid') NOT NULL DEFAULT 'pending';
