-- Services & packs additionnels (idempotent si titres déjà présents)

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active)
SELECT 20, '⚙️', 'Automatisation & intégrations', 'Power Automate, n8n, webhooks et connexions API entre vos outils métiers.', 'Automatiser mes processus', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_lines WHERE title = 'Automatisation & intégrations' LIMIT 1);

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active)
SELECT 21, '📋', 'Gestion des licences & inventaire SAM', 'Inventaire logiciel, suivi M365, rationalisation des coûts et conformité éditeurs.', 'Optimiser mes licences', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_lines WHERE title = 'Gestion des licences & inventaire SAM' LIMIT 1);

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active)
SELECT 22, '🛡️', 'Conformité RGPD & DPO externalisé', 'Registre des traitements, DPIA allégées, sensibilisation équipes et accompagnement conformité.', 'Structurer ma conformité', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_lines WHERE title = 'Conformité RGPD & DPO externalisé' LIMIT 1);

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active)
SELECT 23, '♻️', 'Reprise & destruction sécurisée', 'Effacement certifié, recyclage et traçabilité des équipements en fin de vie.', 'Écouler mon ancien parc', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_lines WHERE title = 'Reprise & destruction sécurisée' LIMIT 1);

INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active)
SELECT 24, '💳', 'Financement & location de parc IT', 'Location longue durée, crédit-bail partenaire et renouvellement maîtrisé du matériel.', 'Financer mon parc', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_lines WHERE title = 'Financement & location de parc IT' LIMIT 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active)
SELECT 100, 'Pack MSP « cabinet & professions libérales »', '', 'Infogérance sectorielle', 'Cabinets médicaux, juridiques, comptables', JSON_ARRAY('Postes sécurisés & sauvegardes', 'Messagerie pro & agenda', 'Support prioritaire', 'Conformité & confidentialité'), 0, 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_packs WHERE title = 'Pack MSP « cabinet & professions libérales »' LIMIT 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active)
SELECT 101, 'Pack MSP « école & formation »', '', 'Infogérance sectorielle', 'Établissements scolaires & CFA', JSON_ARRAY('Wi-Fi élèves / admin séparés', 'Postes salles & vidéoprojecteurs', 'Filtrage contenu option', 'Accompagnement vacances scolaires'), 0, 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_packs WHERE title = 'Pack MSP « école & formation »' LIMIT 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active)
SELECT 102, 'Pack MSP « commerce & retail »', '', 'Infogérance sectorielle', 'Points de vente & franchises', JSON_ARRAY('TPE / caisse & stock', 'VPN siège ↔ magasins', 'Astreinte ouvertures', 'Paiement & réseau sécurisés'), 0, 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_packs WHERE title = 'Pack MSP « commerce & retail »' LIMIT 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active)
SELECT 103, 'Pack DPO / RGPD starter', 'Juridique + IT', 'Conformité', 'PME et associations', JSON_ARRAY('Atelier cadrage', 'Registre des traitements modèle', 'Politique confidentialité site', 'Sensibilisation 1 session'), 450000, 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_packs WHERE title = 'Pack DPO / RGPD starter' LIMIT 1);

INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active)
SELECT 104, 'Pack Location & financement parc', 'Partenaires', 'Financement', 'PME', JSON_ARRAY('Étude TCO', 'Mise en relation leasing', 'Renouvellement planifié', 'Recyclage fin de cycle'), 0, 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_packs WHERE title = 'Pack Location & financement parc' LIMIT 1);

UPDATE it_managed_tiers
SET highlights = JSON_ARRAY(
  'Tout Performance',
  'Astreinte élargie (option)',
  'Rapport mensuel',
  'Comité trimestriel',
  'Option SOC léger / monitoring 24x7 (sur devis)'
)
WHERE name = 'Premium' AND is_active = 1;

INSERT INTO it_service_addons (sort_order, label, is_active)
SELECT 20, 'SOC léger / monitoring 24x7 (option Premium)', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_addons WHERE label = 'SOC léger / monitoring 24x7 (option Premium)' LIMIT 1);

INSERT INTO it_service_addons (sort_order, label, is_active)
SELECT 21, 'Inventaire SAM & rationalisation licences', 1
WHERE NOT EXISTS (SELECT 1 FROM it_service_addons WHERE label = 'Inventaire SAM & rationalisation licences' LIMIT 1);
