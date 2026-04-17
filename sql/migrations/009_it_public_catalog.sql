-- Catalogue public Services IT (lignes, packs, paliers infogérance, options) — éditable par l’admin

CREATE TABLE IF NOT EXISTS it_service_lines (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sort_order INT NOT NULL DEFAULT 0,
  icon VARCHAR(32) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cta VARCHAR(200) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_it_service_lines_sort (sort_order),
  KEY idx_it_service_lines_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS it_managed_tiers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sort_order INT NOT NULL DEFAULT 0,
  name VARCHAR(120) NOT NULL,
  audience VARCHAR(200) NOT NULL,
  from_price_fcfa INT UNSIGNED NOT NULL,
  highlights JSON NOT NULL,
  sla VARCHAR(400) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_it_managed_tiers_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS it_service_packs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sort_order INT NOT NULL DEFAULT 0,
  title VARCHAR(200) NOT NULL,
  badge VARCHAR(120) NOT NULL DEFAULT '',
  subtitle VARCHAR(200) NOT NULL,
  audience VARCHAR(200) NOT NULL,
  items JSON NOT NULL,
  from_price_fcfa INT UNSIGNED NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_it_service_packs_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS it_service_addons (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sort_order INT NOT NULL DEFAULT 0,
  label VARCHAR(400) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_it_service_addons_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données initiales (alignées sur lib/offers-catalog.ts au moment de la migration)

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active) VALUES
(0, '🌐', 'Développement web & applications', 'Sites vitrines, e-commerce, apps métier légères, performances et SEO technique de base.', 'Demander un devis site / app', 1),
(1, '🛠️', 'Maintenance & support IT', 'Helpdesk, dépannage, gestion de parc, mises à jour, incidents utilisateurs.', 'Souscrire au support', 1),
(2, '📱', 'Community management', 'Calendrier éditorial, création visuelle, animation communauté.', 'Déléguer les réseaux', 1),
(3, '☁️', 'Microsoft 365 & messagerie', 'Création de comptes, groupes, sauvegardes M365, migration messagerie.', 'Migrer vers M365', 1),
(4, '🎨', 'Identité visuelle & supports', 'Logo, charte, templates réseaux sociaux, print.', 'Créer mon identité', 1),
(5, '💾', 'Sauvegardes & continuité', 'Stratégie 3-2-1, NAS, cloud, tests de restauration planifiés.', 'Auditer mes sauvegardes', 1),
(6, '🔐', 'Cybersécurité & réseaux', 'Firewall, VPN, segmentation Wi-Fi, MFA, durcissement postes, sensibilisation.', 'Renforcer la sécurité', 1),
(7, '📡', 'Réseau & Wi-Fi professionnel', 'Audit couverture, VLAN invités, supervision légère, dépannage terrain.', 'Optimiser le réseau', 1),
(8, '📊', 'Audit & transformation digitale', 'Diagnostic SI, feuille de route priorisée, quick wins.', 'Planifier un audit', 1),
(9, '📞', 'Téléphonie & visioconférence', 'Choix stack, déploiement salles de réunion, support utilisateurs.', 'Moderniser la com''', 1);

INSERT INTO it_managed_tiers (sort_order, name, audience, from_price_fcfa, highlights, sla, is_active) VALUES
(0, 'Essentiel', 'TPE / indépendants', 25000, JSON_ARRAY('Antivirus géré', 'Sauvegarde poste de base', 'Support 5j/7 heures ouvrées', 'Patchs mensuels'), 'Première réponse sous 8h ouvrées (visée)', 1),
(1, 'Performance', 'PME 5–50 postes', 45000, JSON_ARRAY('Tout Essentiel', 'Supervision santé machines', 'M365 léger (conseil + run)', 'Heures intervention incluses'), 'Première réponse sous 4h ouvrées (visée)', 1),
(2, 'Premium', 'Structures critiques', 75000, JSON_ARRAY('Tout Performance', 'Astreinte élargie (option)', 'Rapport mensuel', 'Comité trimestriel'), 'SLA critique sur devis (HNO possible)', 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active) VALUES
(0, 'Pack Particulier – Essentiel', '', 'Support & maintenance IT', 'Particuliers, étudiants, freelances', JSON_ARRAY('Assistance à distance', 'Dépannage logiciel', 'Installation de programmes', 'Optimisation PC', 'Conseils personnalisés'), 15000, 1),
(1, 'Pack Pro – PME', 'Le plus choisi', 'Support & maintenance IT', 'Startups, PME', JSON_ARRAY('Maintenance régulière', 'Support utilisateurs', 'Intervention rapide', 'Gestion des incidents', 'Optimisation réseau'), 85000, 1),
(2, 'Pack Entreprise – Premium', 'Recommandé', 'Support & maintenance IT', 'Entreprises structurées', JSON_ARRAY('Maintenance complète', 'Support prioritaire', 'Surveillance des systèmes', 'Sécurité informatique', 'Reporting mensuel'), 220000, 1),
(3, 'Pack Starter – Lancement', '', 'Identité visuelle', 'Marques en démarrage', JSON_ARRAY('Création de logo', 'Palette de couleurs', 'Typographie', '2 propositions + retouches'), 120000, 1),
(4, 'Pack Standard – Professionnel', 'Populaire', 'Identité visuelle', 'PME, entrepreneurs', JSON_ARRAY('Logo professionnel', 'Charte graphique', 'Cartes de visite', 'Visuels réseaux sociaux', 'Déclinaisons du logo'), 280000, 1),
(5, 'Pack Premium – Branding complet', '', 'Identité visuelle', 'Entreprises ambitieuses', JSON_ARRAY('Logo + branding complet', 'Charte graphique avancée', 'Kit réseaux sociaux', 'Templates marketing', 'Supports print'), 650000, 1),
(6, 'Pack Starter – Présence', '', 'Community management', 'Petites structures', JSON_ARRAY('Création/optimisation de page', '8 publications/mois', 'Design simple', 'Programmation'), 95000, 1),
(7, 'Pack Growth – Développement', 'Le plus choisi', 'Community management', 'PME en croissance', JSON_ARRAY('12 à 16 publications/mois', 'Visuels professionnels', 'Rédaction optimisée', 'Gestion interactions', 'Stratégie de contenu'), 185000, 1),
(8, 'Pack Premium – Domination', '', 'Community management', 'Marques ambitieuses', JSON_ARRAY('Publications intensives', 'Stratégie marketing complète', 'Analyse performances', 'Gestion complète interactions', 'Campagnes ads (option)'), 350000, 1),
(9, 'Pack Site vitrine', '', 'Développement web', 'TPE / indépendants', JSON_ARRAY('Design responsive', '5–8 pages', 'Formulaire contact', 'Hébergement 1 an (option)', 'Formation prise en main'), 450000, 1),
(10, 'Pack E-commerce starter', 'Nouveau', 'Développement web', 'Commerçants', JSON_ARRAY('Catalogue produits', 'Paiement mobile money / lien', 'Back-office commandes', 'SEO de base'), 950000, 1),
(11, 'Pack Audit cybersécurité express', '', 'Cybersécurité', 'PME', JSON_ARRAY('Interview direction', 'Scan configuration', 'Top 10 risques', 'Plan action 30 jours'), 380000, 1);

INSERT INTO it_service_addons (sort_order, label, is_active) VALUES
(0, 'Forfait déplacement Abidjan & périphérie', 1),
(1, 'Astreinte week-end / jours fériés', 1),
(2, 'Hébergement & nom de domaine', 1),
(3, 'Licences Microsoft 365 (revente + run)', 1),
(4, 'Matériel : commande groupée Boutique IT', 1),
(5, 'Formation utilisateurs (demi-journée)', 1);
