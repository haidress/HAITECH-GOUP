UPDATE sessions
SET token = SHA2(token, 256)
WHERE token REGEXP '^[0-9a-fA-F]{64}$' = 0;
