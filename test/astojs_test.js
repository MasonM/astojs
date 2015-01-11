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

    it('single-element record', generateTest('{ product: "pen" }', 'new Record({product:"pen"});'));
    it('multi-element record', generateTest('{product:"pen", price:2.34}', 'new Record({product:"pen",price:2.34});'));
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
    it('conjunction', generateTest('a and b', 'a&&b;'));
    it('disjunction', generateTest('a or b', 'a||b;'));
    it('negation',    generateTest('not a', '!a;'));
});

describe('concatenation:', function () {
    it('two strings literals', generateTest('"foo" & "bar"', '"foo"+"bar";'));
    it('one string, one variable', generateTest('a & "bar"', 'a.concat("bar");'));

    it('two lists', generateTest('{1, 2} & {4, 5}', '[1,2].concat([4,5]);'));
    it('one variable on left, one list on right', generateTest('a & {4, 5}', 'a.concat([4,5]);'));

    it('two records', generateTest('{foo: "bar"} & {bam: "baz"}', 'new Record({foo:"bar"}).concat(new Record({bam:"baz"}));'));
    it('one variable on left, one record on right', generateTest('a & {foo:"bar"}', 'a.concat(new Record({foo:"bar"}));'));
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
    it('if with multi-statement body', generateTest("if a then\nb\nc\nend if", "if(a){b;c;}"));
    it('multiple nested ifs', generateTest("if a then\nif b\nc\nend end if", "if(a){if(b){c;}}"));
});

describe('repeat statement:', function () {
    it('repeat without test', 
        generateTest('repeat a end repeat', 'while(true){a;}'));
    it('repeat n times', 
        generateTest('repeat 5 times a end', 'for(let n=0;n<5;n++){a;}'));
    it('repeat while', 
        generateTest('repeat while a b end', 'while(a){b;}'));
    it('repeat until', 
        generateTest('repeat until a b end', 'while(!a){b;}'));
    it('repeat with variable from integer to integer', 
        generateTest('repeat with a from 0 to 5 b end', 'for(let a=0;a<5;a++){b;}'));
    it('repeat with list', 
        generateTest('repeat with a in {1,2} b end', 'for(a in[1,2]){b;}'));
});

describe('subroutines:', function () {
    it('simple subroutine with no parameters', generateTest('on helloWorld() return a end', 'function helloWorld(){return a;}'));
    it('simple positional subroutine with a couple parameters', generateTest("on minimumValue(x, y) x end minimumValue", "function minimumValue(x,y){x;}"));

    it('complex positional subroutine with a couple parameters', generateTest("on minimumValue(x, y)\n"+
        "if x < y then\n" +
        "   return x\n" + 
        "else\n" + 
        "   return y\n" +
        "end if\n" + 
    "end minimumValue", 'function minimumValue(x,y){if(x<y){return x;}else{return y;}}'));
});
