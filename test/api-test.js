var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa');

var assert = require('assert');
describe('API', function() {
  describe('Tests for get and post', function() {

    //Tests
    it('GET products from /api/products with status 200', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'GET', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 200);
    });

    it('Check that unauthorized user cannot access POST', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'POST', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products/new', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 401);
    });
  });
});
