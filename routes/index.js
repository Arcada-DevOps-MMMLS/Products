const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://sgjlqretcezzmh:9e6d09dc7d5064c6200c96932f68c72f42fd236bfbd5836064f2fa0ee4394291@ec2-54-246-101-215.eu-west-1.compute.amazonaws.com:5432/d7svabbdvvn7l1';


router.get('/api/products', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/products/new', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {
    name: req.body.name,
    brand: req.body.brand,
    size: req.body.size,
    color: req.body.color,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    gender: req.body.gender
  };
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO product(name, brand, size, color, description, quantity, price, gender) values($1, $2, $3, $4, $5, $6, $7, $8)',
    [data.name, data.brand, data.size, data.color, data.description, data.quantity, data.price, data.gender]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
