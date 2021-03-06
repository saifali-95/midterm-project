DROP TABLE IF EXISTS chats CASCADE;

-- Create chats Table
CREATE TABLE chats (
  id SERIAL PRIMARY KEY NOT NULL,
  chat_service_id INTEGER REFERENCES chat_service(id) ON DELETE CASCADE,
  from_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);

