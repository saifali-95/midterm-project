DROP TABLE IF EXISTS chat_service CASCADE;

-- Create chat_service Table

CREATE TABLE chat_service (
  id SERIAL PRIMARY KEY NOT NULL,
  from_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);
