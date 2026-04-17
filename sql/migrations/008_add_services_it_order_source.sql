-- Étendre les commandes clients aux prestations Services IT (packs / abonnements)
ALTER TABLE customer_orders
  MODIFY COLUMN source_type ENUM(
    'business_center',
    'boutique_it',
    'formation',
    'services_it'
  ) NOT NULL;
