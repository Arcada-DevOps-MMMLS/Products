var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa');

var assert = require('assert');
describe('API authorization', function() {
  describe('Tests authorization for get and post', function() {

    //Tests
    it('GET products should return 200', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'GET', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 200);
    });

    it('POST from unauthorized user should return 401', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'POST', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products/new', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.status === 401);
    });
  });
});
