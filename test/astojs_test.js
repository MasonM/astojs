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

describe('arithmetic expressions:', function () {
    it('multiply',        generateTest('2 * 4', '2*4;'));
    it('add',             generateTest('2 + 4', '2+4;'));
    it('subtract',        generateTest('2 - 4', '2-4;'));
    it('divide with /',   generateTest('2 / 4', '2/4;'));
    it('divide with div', generateTest('2 div 4', '2/4;'));
    it('divide with ÷',   generateTest('2 ÷ 4', '2/4;'));
    it('modulo',          generateTest('2 mod 4', '2%4;'));
    it('exponentiation',  generateTest('2^4', 'Math.pow(2,4);'));
});

describe('logical expressions:', function () {
    it('conjunction', generateTest('a and b', 'a&&b;'))
    it('disjunction', generateTest('a or b', 'a||b;'))
    it('negation',    generateTest('not a', '!a;'))
});

describe('variable statement:', function () {
    it('set variable with number literal', 
        generateTest('set a to 5', 'var a=5;'));
    it('set variable with string literal', 
        generateTest('set a to "test"', 'var a="test";'));
    it('set variable with boolean literal', 
        generateTest('set a to true', 'var a=true;'));
    it('set variable with identifier value', 
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

describe('repeat statement:', function () {
    it('repeat without test', 
        generateTest('repeat a end repeat', 'while(true){a;}'));

    it('repeat n times', 
        generateTest('repeat 5 times a end', 'for(let n=0;n<5;n++){a;}'));
});
