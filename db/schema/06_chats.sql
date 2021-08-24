DROP TABLE IF EXISTS messages CASCADE;

-- Create Messages Table
CREATE TABLE chats (
  id SERIAL PRIMARY KEY NOT NULL,
  from_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);
