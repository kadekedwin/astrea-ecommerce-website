import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

export async function query(sql: string, values?: unknown[]) {
  const connection = await mysql.createConnection(dbConfig)
  try {
    const [rows] = await connection.execute(sql, values)
    return rows
  } finally {
    await connection.end()
  }
}

export async function execute(sql: string, values?: unknown[]) {
  const connection = await mysql.createConnection(dbConfig)
  try {
    const [result] = await connection.execute(sql, values)
    return result
  } finally {
    await connection.end()
  }
}

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      price DECIMAL(10,2) NOT NULL,
      originalPrice DECIMAL(10,2),
      stock INT NOT NULL,
      category INT,
      rating DECIMAL(3,2),
      reviews INT,
      description TEXT,
      img VARCHAR(500),
      badge VARCHAR(100),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `)
}