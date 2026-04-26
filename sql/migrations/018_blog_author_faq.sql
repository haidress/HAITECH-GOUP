-- Auteur, FAQ structurée (JSON-LD), catégories/tags plus longs
ALTER TABLE blog_posts
  MODIFY COLUMN category VARCHAR(255) NOT NULL DEFAULT 'actualites';

ALTER TABLE blog_posts
  ADD COLUMN author_name VARCHAR(120) NOT NULL DEFAULT 'HAITECH GROUP' AFTER og_image_path;

ALTER TABLE blog_posts
  ADD COLUMN faq_json JSON NULL AFTER author_name;
