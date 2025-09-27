import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'astrea'
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

  const categories = await query('SELECT COUNT(*) as count FROM categories') as {count: number}[]
  if (categories[0].count === 0) {
    await query("INSERT INTO categories (name, slug) VALUES ('Electronics', 'electronics')")
    await query("INSERT INTO categories (name, slug) VALUES ('Clothing', 'clothing')")
    await query("INSERT INTO categories (name, slug) VALUES ('Books', 'books')")
  }

  const products = await query('SELECT COUNT(*) as count FROM products') as {count: number}[]
  if (products[0].count === 0) {
    await query(`
      INSERT INTO products (name, slug, price, stock, category, rating, reviews, description, img)
      VALUES ('Laptop', 'laptop', 1000.00, 10, 1, 4.5, 100, 'A powerful laptop', 'https://via.placeholder.com/150')
    `)
    await query(`
      INSERT INTO products (name, slug, price, stock, category, rating, reviews, description, img)
      VALUES ('T-Shirt', 't-shirt', 20.00, 50, 2, 4.0, 50, 'Comfortable t-shirt', 'https://via.placeholder.com/150')
    `)
    await query(`
      INSERT INTO products (name, slug, price, stock, category, rating, reviews, description, img)
      VALUES ('Book', 'book', 15.00, 30, 3, 4.2, 20, 'Interesting book', 'https://via.placeholder.com/150')
    `)
  }
}