var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa');

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('GET products from /api/products with status 200', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'GET', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 200);
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('POST products from /api/products with status 200', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
      xmlHttp.open( 'GET', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 200);
    });
  });
});
