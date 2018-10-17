const express = require('express');
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

/*
//Authenticate user
router.post('/authenticate',(req,res)=>{

    if(req.body.username==="frontend"){

        if(req.body.password===123){
             //if eveything is okey let's create our token

        const payload = {

            check:  true

          };

          var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours

          });


          res.json({
            message: 'authentication done ',
            token: token
          });

        }else{
            res.json({message:"please check your password !"});
        }

    }else{

        res.json({message:"user not found !"});

    }

});
*/

//GET products
router.get('/api/products', (req, res, next) => {

  const results = [];
  const headerData = {
    name: req.header.username,
    password: req.header.password
  };

  isAuthenticated = authCheck(headerData.name, headerData.password);

  if(isAuthenticated){
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
  }else{
    res.render('error');
  }
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

//DELETE a product
router.delete('/api/products/delete/:id', (req, res, next) => {
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
});

//UPDATE a product
router.put('/api/products/update/:id', (req, res, next) => {
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
    client.query('UPDATE product SET name=($1), brand=($2), size=($3), color=($4), description=($5), quantity=($6), price=($7), gender=($8) WHERE id=($9)',
    [data.name, data.brand, data.size, data.color, data.description, data.quantity, data.price, data.gender, id]);
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
});


function authCheck(name, password){
  if(name==="frontend"){

      if(password===123){
           //if eveything is okey let's create our token

      const payload = {

          check:  true

        };

        /*var token = jwt.sign(payload, app.get('Secret'), {
              expiresIn: 1440 // expires in 24 hours

        });*/


        /*res.json({
          message: 'authentication done ',
          token: token
        });*/
        return true;

      }else{
          //res.json({message:"please check your password !"});
          return false;
      }

  }/*else{

      //res.json({message:"user not found !"});
      return false;

  }*/
}

module.exports = router;
