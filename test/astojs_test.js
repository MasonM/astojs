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
    it('divide with ÷',   generateTest('2 ÷ 4', '2/4;'));
    it('integer divide',  generateTest('2 div 4', 'Math.floor(2/4);'));
    it('modulo',          generateTest('2 mod 4', '2%4;'));
    it('exponentiation',  generateTest('2^4', 'Math.pow(2,4);'));
});

describe('logical expressions:', function () {
    it('conjunction', generateTest('a and b', 'a&&b;'));
    it('disjunction', generateTest('a or b', 'a||b;'));
    it('negation',    generateTest('not a', '!a;'));
});

describe('comparison expressions:', function () {
    it('=', generateTest('a = b', 'a===b;'));
    it('equal', generateTest('a equal b', 'a===b;'));
    it('equals', generateTest('a equals b', 'a===b;'));
    it('equal to', generateTest('a equal to b', 'a===b;'));
    it('is equal to', generateTest('a is equal to b', 'a===b;'));

    it('≠', generateTest('a ≠ b', 'a!==b;'));
    it('is not', generateTest('a is not b', 'a!==b;'));
    it('isn\'t', generateTest('a isn\'t b', 'a!==b;'));
    it('isn\'t equal to', generateTest('a isn\'t equal to b', 'a!==b;'));
    it('is not equal to', generateTest('a is not equal to b', 'a!==b;'));
    it('doesn\'t equal', generateTest('a doesn\'t equal b', 'a!==b;'));
    it('does not equal', generateTest('a does not equal b', 'a!==b;'));

    it('<', generateTest('a < b', 'a<b;'));
    it('comes before', generateTest('a comes before b', 'a<b;'));
    it('less than', generateTest('a less than b', 'a<b;'));
    it('is less than', generateTest('a is less than b', 'a<b;'));
    it('is not greater than or equal to', generateTest('a is not greater than or equal to b', 'a<b;'));
    it('isn\'t greater than or equal to', generateTest('a isn\'t greater than or equal to b', 'a<b;'));

    it('>', generateTest('a > b', 'a>b;'));
    it('comes after', generateTest('a comes after b', 'a>b;'));
    it('greater than', generateTest('a greater than b', 'a>b;'));
    it('is greater than', generateTest('a is greater than b', 'a>b;'));
    it('is not less than or equal to', generateTest('a is not less than or equal to b', 'a>b;'));
    it('isn\'t less than or equal to', generateTest('a isn\'t less than or equal to b', 'a>b;'));

    it('<=', generateTest('a <= b', 'a<=b;'));
    it('≤', generateTest('a ≤ b', 'a<=b;'));
    it('does not come after', generateTest('a does not come after b', 'a<=b;'));
    it('doesn\'t come after', generateTest('a doesn\'t come after b', 'a<=b;'));
    it('is less than or equal to', generateTest('a is less than or equal to b', 'a<=b;'));
    it('is not greater than', generateTest('a is not greater than b', 'a<=b;'));
    it('isn\'t greater than', generateTest('a isn\'t greater than b', 'a<=b;'));
    it('less than or equal to', generateTest('a less than or equal to b', 'a<=b;'));

    it('>=', generateTest('a >= b', 'a>=b;'));
    it('≥', generateTest('a ≥ b', 'a>=b;'));
    it('does not come before', generateTest('a does not come before b', 'a>=b;'));
    it('doesn\'t come before', generateTest('a doesn\'t come before b', 'a>=b;'));
    it('is greater than or equal to', generateTest('a is greater than or equal to b', 'a>=b;'));
    it('is not less than', generateTest('a is not less than b', 'a>=b;'));
    it('isn\'t less than', generateTest('a isn\'t less than b', 'a>=b;'));
    it('greater than or equal to', generateTest('a greater than or equal to b', 'a>=b;'));
});

describe('containment expressions:', function () {
    it('starts with', generateTest('a starts with "foo"', 'a.startsWith("foo");'));
    it('begin with', generateTest('a begin with "foo"', 'a.startsWith("foo");'));
    it('ends with', generateTest('a ends with "foo"', 'a.endsWith("foo");'));

    it('contains', generateTest('a contains "foo"', 'a.contains("foo");'));
    it('is in', generateTest('a is in "foo"', '"foo".contains(a);'));
    it('is contained by', generateTest('a is contained by "foo"', '"foo".contains(a);'));

    it('does not contain', generateTest('a does not contain "foo"', '!a.contains("foo");'));
    it('doesn\'t contain', generateTest('a doesn\'t contain "foo"', '!a.contains("foo");'));
    it('is not in', generateTest('a is not in "foo"', '!"foo".contains(a);'));
    it('is not contained by', generateTest('a is not contained by "foo"', '!"foo".contains(a);'));
    it('isn\'t contained by', generateTest('a isn\'t contained by "foo"', '!"foo".contains(a);'));
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

    it('copy number literal to variable',
        generateTest('copy 5 to a', 'var a=5;'));
    it('copy identifier to variable', 
        generateTest('copy a to b', 'var b=a;'));
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

describe('positional subroutines:', function () {
    it('simple subroutine with no parameters', generateTest('on helloWorld() return a end', 'function helloWorld(){return a;}'));
    it('simple subroutine with one parameters', generateTest('on helloWorld(a) return a end', 'function helloWorld(a){return a;}'));
    it('simple positional subroutine with a couple parameters', generateTest("on minimumValue(x, y) x end minimumValue", "function minimumValue(x,y){x;}"));

    it('complex positional subroutine with a couple parameters', generateTest("on minimumValue(x, y)\n"+
        "if x < y then\n" +
        "   return x\n" + 
        "else\n" + 
        "   return y\n" +
        "end if\n" + 
    "end minimumValue", 'function minimumValue(x,y){if(x<y){return x;}else{return y;}}'));

    it('call to subroutine with no parameters', generateTest('helloWorld()', 'helloWorld();'));
    it('call to subroutine with one parameter', generateTest('helloWorld (a)', 'helloWorld(a);'));
    it('call to subroutine with several parameters', generateTest('helloWorld(foo, 2+2, "bar")', 'helloWorld(foo,2+2,"bar");'));
});

describe('labelled subroutines:', function () {
    it('simple subroutine with one AS labelled parameter', generateTest("on rock around the clock\n"+
        "return clock\n"+
    "end", 'function rock(args){var clock=args["around"];return clock;}'));

    it('simple subroutine with one direct parameter', generateTest("to findMininum of numList\nnumList\nend findMininum",
        'function findMininum(args){var numList=args["of"];numList;}'));
});

describe('script objects:', function () {
    it('minimal script object', generateTest('script helloWorld end', 'function helloWorld(){}'));
    it('script object with a property', generateTest("script helloWorld \n"+
        "property foo : \"bar\"\n" +
    "end script", 'function helloWorld(){this.foo="bar";}'));
    it('script object with multiple properties', generateTest("script helloWorld \n"+
        "property foo : \"bar\"\n" +
        "property bam : \"baz\"\n" +
        "property bar : \"bao\"\n" +
    "end", 'function helloWorld(){this.foo="bar";this.bam="baz";this.bar="bao";}'));

    it('script object with a handler', generateTest("script helloWorld\n" +
        "on sayHello()\n" +
        "   return 'Hello'\n" +
        "end sayHello\n" +
    "end", "function helloWorld(){"+
        "this.sayHello=function sayHello(){"+
            "return\"Hello\";"+
        "};"+
    "}"));

    it('script object with a handler and a property', generateTest("script helloWorld\n" +
        "property HowManyTimes:0\n" +
        "on sayHello(someone)\n" +
        "   return 'Hello'\n" +
        "end\n" +
    "end", "function helloWorld(){"+
        "this.HowManyTimes=0;"+
        "this.sayHello=function sayHello(someone){"+
            "return\"Hello\";"+
        "};"+
    "}"));
});
