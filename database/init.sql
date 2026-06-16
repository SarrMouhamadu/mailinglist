CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  organization VARCHAR(150),
  position VARCHAR(100),
  profile VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
