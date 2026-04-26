CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  cover_image_path VARCHAR(255) NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'actualites',
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(500) NOT NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(500) NULL,
  og_image_path VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_blog_posts_slug (slug),
  KEY idx_blog_posts_status_published_at (status, published_at),
  KEY idx_blog_posts_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  status,
  published_at,
  meta_title,
  meta_description,
  og_title,
  og_description
)
SELECT
  'Comment accélérer son ordinateur sans le changer',
  'accelerer-son-ordinateur',
  'Les actions simples et efficaces pour rendre un ordinateur plus rapide au quotidien.',
  'Un ordinateur lent peut freiner toute la productivité. Commencez par nettoyer les programmes au démarrage, mettre à jour le système, vérifier le stockage disponible et supprimer les logiciels inutiles. Ajoutez ensuite une routine de maintenance mensuelle : nettoyage des fichiers temporaires, scans de sécurité et sauvegardes régulières.',
  'it',
  'published',
  DATE_SUB(NOW(), INTERVAL 21 DAY),
  'Comment accélérer son ordinateur | Conseils HAITECH',
  'Découvrez les étapes simples pour améliorer les performances de votre ordinateur sans investir immédiatement dans un nouveau matériel.',
  'Comment accélérer son ordinateur',
  'Checklist pratique pour booster les performances de votre PC.'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'accelerer-son-ordinateur' LIMIT 1);

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  status,
  published_at,
  meta_title,
  meta_description,
  og_title,
  og_description
)
SELECT
  'Meilleurs outils digitaux pour PME en Afrique',
  'meilleurs-outils-pme-afrique',
  'Une sélection concrète d’outils cloud utiles pour la gestion, la vente et la collaboration.',
  'Les PME africaines peuvent gagner du temps avec des outils adaptés : suite collaborative cloud, CRM simple, facturation automatisée, sauvegardes externalisées et outils de suivi client. Le plus important est de choisir peu d’outils mais bien intégrés, avec des processus clairs et une équipe formée.',
  'business',
  'published',
  DATE_SUB(NOW(), INTERVAL 14 DAY),
  'Outils digitaux pour PME en Afrique | HAITECH',
  'Découvrez les meilleurs outils digitaux pour structurer et accélérer la croissance d’une PME en Afrique.',
  'Meilleurs outils pour PME en Afrique',
  'Solutions concrètes pour vendre, collaborer et gérer efficacement.'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'meilleurs-outils-pme-afrique' LIMIT 1);

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  status,
  published_at,
  meta_title,
  meta_description,
  og_title,
  og_description
)
SELECT
  'Pourquoi créer un site web pour son entreprise',
  'pourquoi-creer-site-web-entreprise',
  'Visibilité, crédibilité, génération de leads : les vraies raisons de créer un site web professionnel.',
  'Un site web professionnel est votre vitrine 24h/24. Il améliore la crédibilité, facilite la prise de contact et permet de capter des demandes qualifiées via des formulaires. Avec un bon SEO local et du contenu utile, votre site devient un canal d’acquisition durable.',
  'seo',
  'published',
  DATE_SUB(NOW(), INTERVAL 7 DAY),
  'Pourquoi créer un site web entreprise | HAITECH',
  'Les raisons business et marketing de lancer un site web performant pour votre entreprise.',
  'Pourquoi créer un site web',
  'Le site web comme levier de visibilité et de conversion.'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'pourquoi-creer-site-web-entreprise' LIMIT 1);
