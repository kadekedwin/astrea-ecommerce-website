CREATE DATABASE IF NOT EXISTS astrea_ecommerce;

USE astrea_ecommerce;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);

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
);