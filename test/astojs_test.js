/*global describe,it*/
'use strict';

var should = require('should'),
    compiler = require('../src/compiler'),
    util = require('util');
    
function generateTest(code, expectation) {
  return function () {
      console.log(compiler.compile(code));
    should(compiler.compile(code)).be.exactly(expectation);
  };
}

describe('literals:', function () {
  it('true boolean', generateTest('true', 'true;'));
  it('false boolean', generateTest('false', 'false;'));
  it('decimal number', generateTest('10', '10;'));
});

describe('variable statement:', function () {
  it('create variable', 
    generateTest('set a to 1;', 'var a = 1;'));
    
  it('create variable with number literal', 
    generateTest('var a = 5;', 'let a = 5;'));
    
  it('create variable with string literal', 
    generateTest('var a = "test";', 'let a = "test";'));
  
  it('create variable with boolean literal', 
    generateTest('var a = true;', 'let a = true;'));
    
  it('create variable with null literal', 
    generateTest('var a = null;', 'let a = null;'));
    
  it('create variable with identifier value', 
    generateTest('var a = b;', 'let a = b;'));
    
  it('create multiple variables in one statement', 
    generateTest('var a, b;', 'let a, b;'));

  it('create multiple variables in one statement with values', 
    generateTest('var a = 5, b = false;', 'let a = 5, b = false;'));
    
  it('create multiple variables in multiple statements', 
    generateTest('var a; var b;', 'let a;\nlet b;'));  
});
