DROP TABLE IF EXISTS orders CASCADE;

-- Create Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date timestamp NOT NULL DEFAULT NOW()
);
