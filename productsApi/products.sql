CREATE DATABASE products;

\c products;

CREATE TABLE product (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  brand VARCHAR,
  size INTEGER,
  color VARCHAR,
  description TEXT,
  quantity INTEGER,
  price DECIMAL,
  gender VARCHAR
);

INSERT INTO product(name, brand, size, color, description, quantity, price, gender)
  VALUES('Airmax', 'Nike', '42', 'blue', 'Very nice shoes', '1', '1000,00', 'male');
