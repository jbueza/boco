
/**
 * Module dependencies.
 */

var boco = require('boco')
  , should = require('should');

module.exports = {
  'test .version': function(){
    boco.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};