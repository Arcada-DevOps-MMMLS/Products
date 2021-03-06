const express = require('express');

const basicAuth = require('express-basic-auth');
var private = require('express-http-auth').realm('Private Area');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://sgjlqretcezzmh:9e6d09dc7d5064c6200c96932f68c72f42fd236bfbd5836064f2fa0ee4394291@ec2-54-246-101-215.eu-west-1.compute.amazonaws.com:5432/d7svabbdvvn7l1';
bodyParser = require('body-parser'),
morgan      = require('morgan'),
jwt    = require('jsonwebtoken'),
config = require('../configurations/config'),
app = express();

//set secret
app.set('Secret', config.secret);

// use morgan to log requests to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//GET products
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

//Get a single product
router.get('/api/product/:id', (req, res, next) => {
  const results = [];
  const id = req.params.id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product where id = $1;', [id]);
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

//POST a new product
router.post('/api/products/new', private, (req, res, next) => {

  if (req.username == 'admin' && req.password == 'admin') {

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
    client.query('INSERT INTO product(name, brand, size, color, description, price, gender) values($1, $2, $3, $4, $5, $6, $7)',
    [data.name, data.brand, data.size, data.color, data.description, data.price, data.gender]);
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
}else {
  res.send(403);
}
});

//DELETE a product
router.delete('/api/products/delete/:id', private, (req, res, next) => {

  if (req.username == 'admin' && req.password == 'admin') {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM product WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM product ORDER BY id ASC');
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
  }else {
    res.send(403);
  }
});

//UPDATE a product
router.put('/api/products/update/:id', private, (req, res, next) => {

  if (req.username == 'admin' && req.password == 'admin') {

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.id;
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
    // SQL Query > Update Data
    client.query('UPDATE product SET name=($1), brand=($2), size=($3), color=($4), description=($5), price=($6), gender=($7) WHERE id=($8)',
    [data.name, data.brand, data.size, data.color, data.description, data.price, data.gender, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM product ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
}else {
  res.send(403);
}
});

module.exports = router;
