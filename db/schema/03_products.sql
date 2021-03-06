DROP TABLE IF EXISTS products CASCADE;

-- Create Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  info TEXT NOT NULL,
  size SMALLINT NOT NULL,
  color VARCHAR(50) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail_photo_url VARCHAR(255) NOT NULL,
  stock BOOLEAN DEFAULT true,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
