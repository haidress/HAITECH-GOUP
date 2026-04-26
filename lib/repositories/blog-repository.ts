import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type BlogPostStatus = "draft" | "published";

export type BlogPostRecord = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  category: string;
  status: BlogPostStatus;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_title: string | null;
  og_description: string | null;
  og_image_path: string | null;
  author_name?: string;
  faq_json?: unknown | null;
  created_at: string;
  updated_at: string;
};

function mapRows(rows: RowDataPacket[]) {
  return rows as unknown as BlogPostRecord[];
}

export async function listAdminBlogPosts(): Promise<BlogPostRecord[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id, title, slug, excerpt, content, cover_image_path, category, status,
      published_at, meta_title, meta_description, og_title, og_description, og_image_path,
      author_name, faq_json, created_at, updated_at
    FROM blog_posts
    ORDER BY COALESCE(published_at, created_at) DESC, id DESC
    `
  );
  return mapRows(rows);
}

export async function listPublishedBlogPosts(limit = 24): Promise<BlogPostRecord[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id, title, slug, excerpt, content, cover_image_path, category, status,
      published_at, meta_title, meta_description, og_title, og_description, og_image_path,
      author_name, faq_json, created_at, updated_at
    FROM blog_posts
    WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
    ORDER BY published_at DESC, id DESC
    LIMIT ?
    `,
    [limit]
  );
  return mapRows(rows);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id, title, slug, excerpt, content, cover_image_path, category, status,
      published_at, meta_title, meta_description, og_title, og_description, og_image_path,
      author_name, faq_json, created_at, updated_at
    FROM blog_posts
    WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
    LIMIT 1
    `,
    [slug]
  );
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows[0] as unknown as BlogPostRecord;
}

export async function listPublishedBlogSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT slug, updated_at
    FROM blog_posts
    WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
    ORDER BY published_at DESC, id DESC
    `
  );
  return rows as Array<{ slug: string; updated_at: string }>;
}

export async function createBlogPost(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  category: string;
  status: BlogPostStatus;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_title: string | null;
  og_description: string | null;
  og_image_path: string | null;
  author_name: string;
  faq_json: string | null;
}) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO blog_posts (
      title, slug, excerpt, content, cover_image_path, category, status, published_at,
      meta_title, meta_description, og_title, og_description, og_image_path,
      author_name, faq_json
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.cover_image_path,
      input.category,
      input.status,
      input.published_at,
      input.meta_title,
      input.meta_description,
      input.og_title,
      input.og_description,
      input.og_image_path,
      input.author_name,
      input.faq_json
    ]
  );
}

export async function updateBlogPost(
  id: number,
  input: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image_path: string | null;
    category: string;
    status: BlogPostStatus;
    published_at: string | null;
    meta_title: string;
    meta_description: string;
    og_title: string | null;
    og_description: string | null;
    og_image_path: string | null;
    author_name: string;
    faq_json: string | null;
  }
) {
  const pool = getDbPool();
  await pool.execute(
    `
    UPDATE blog_posts
    SET
      title = ?,
      slug = ?,
      excerpt = ?,
      content = ?,
      cover_image_path = ?,
      category = ?,
      status = ?,
      published_at = ?,
      meta_title = ?,
      meta_description = ?,
      og_title = ?,
      og_description = ?,
      og_image_path = ?,
      author_name = ?,
      faq_json = ?
    WHERE id = ?
    `,
    [
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.cover_image_path,
      input.category,
      input.status,
      input.published_at,
      input.meta_title,
      input.meta_description,
      input.og_title,
      input.og_description,
      input.og_image_path,
      input.author_name,
      input.faq_json,
      id
    ]
  );
}

export async function deleteBlogPost(id: number) {
  const pool = getDbPool();
  await pool.execute("DELETE FROM blog_posts WHERE id = ?", [id]);
}
