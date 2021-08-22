DROP TABLE IF EXISTS categories CASCADE;

-- Create Cateogies Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);
