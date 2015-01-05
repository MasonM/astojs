/*global describe,it*/
'use strict';

var should = require('should'),
    compiler = require('../src/compiler'),
    util = require('util'),
    compilerOptions = {
        format: {
            quotes: 'double',
            compact: true,
            renumber: true,
            escapeless: true
        }
    };
    
function generateTest(code, expectation) {
  return function () {
    should(compiler.compile(code, compilerOptions)).be.exactly(expectation);
  };
}

describe('literals:', function () {
  it('true boolean',   generateTest('true', 'true;'));
  it('false boolean',  generateTest('false', 'false;'));

  it('decimal number', generateTest('10', '10;'));
  it('negative float', generateTest('-10.51', '-10.51;'));
  it('float in exponential notation', generateTest('10.51E+5', '1051e3;'));

  it('basic string', generateTest('"Foo bar."', '"Foo bar.";'));

  it('single-element list', generateTest('{1}', '[1];'));
  it('complex list', generateTest('{1, 7, "Beethoven", 4.5}', '[1,7,"Beethoven",4.5];'));
});

describe('variable statement:', function () {
  it('create variable with number literal', 
    generateTest('set a to 5', 'var a=5;'));
    
  it('create variable with string literal', 
    generateTest('set a to "test"', 'var a="test";'));
  
  it('create variable with boolean literal', 
    generateTest('set a to true', 'var a=true;'));
    
  it('create variable with identifier value', 
    generateTest('set a to b', 'var a=b;'));
});

describe('if statement:', function () {
  it('simple if without end if', 
    generateTest('if a then b', 'if(a){b;}'));

  it('simple if with end if', 
    generateTest('if a then b end if', 'if(a){b;}'));

  it('simple if, ommitting unnecessary keywords', 
    generateTest('if a b', 'if(a){b;}'));

  it('if with else clause', 
    generateTest('if a then b else c end', 'if(a){b;}else{c;}'));

  it('if with else if and else clause', 
    generateTest('if a then b else if b then c else d end if', 'if(a){b;}else{if(b){c;}else{d;}}'));
});
