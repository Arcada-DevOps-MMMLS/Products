var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('Getting products from /api/products', function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( 'GET', 'https://productsdb-devops-arcada-2018.herokuapp.com/api/products', false );
      xmlHttp.send( null );
      assert.ok(xmlHttp.responseText != null);
    });
  });
});
