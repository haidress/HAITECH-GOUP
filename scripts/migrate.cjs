const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function getEnv(name, fallback = undefined) {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

async function run() {
  const connection = await mysql.createConnection({
    host: getEnv("DB_HOST", "127.0.0.1"),
    user: getEnv("DB_USER", "root"),
    password: getEnv("DB_PASSWORD", ""),
    database: getEnv("DB_NAME", "haitech_group"),
    port: Number(getEnv("DB_PORT", "3306")),
    multipleStatements: true
  });

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      filename VARCHAR(190) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  const migrationsDir = path.join(process.cwd(), "sql", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.log("Aucun dossier sql/migrations trouvé.");
    await connection.end();
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  for (const filename of files) {
    const [existing] = await connection.execute(
      "SELECT id FROM schema_migrations WHERE filename = ? LIMIT 1",
      [filename]
    );
    if (Array.isArray(existing) && existing.length > 0) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, filename), "utf8");
    console.log(`Application migration: ${filename}`);
    await connection.query(sql);
    await connection.execute("INSERT INTO schema_migrations (filename) VALUES (?)", [filename]);
  }

  await connection.end();
  console.log("Migrations terminées.");
}

run().catch((error) => {
  console.error("Erreur migration:", error);
  process.exit(1);
});
