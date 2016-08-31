/*global describe,it*/
'use strict';

var should = require('should'),
    compiler = require('../src/compiler'),
    parser = module.require('../src/parser'),
    util = require('util'),
    compilerOptions = {
        comment: true,
        format: {
            quotes: 'double',
            compact: true,
            renumber: true,
            semicolons: false,
            escapeless: true
        }
    };

function generateTest(code, expectation) {
    return function () {
        var transpiledCode = compiler.compile(parser, code, compilerOptions)
        should(transpiledCode).be.exactly(expectation);
    };
}

suite('comments:', function () {
    test('single-line comment below', generateTest(
        "\n\"foo\"\n-- comment below!",
        // @TODO fix this to preserve the leading newline
        "\"foo\"// comment below!"));
    test('single-line comment above', generateTest(
        "-- comment above!\n\"foo\"",
        "// comment above!\n\"foo\""));
    test('single-line comment to the right', generateTest(
        '"foo" -- EOL comment',
        '"foo"// EOL comment'));

    test('block comment below', generateTest(
        "\n\"foo\"\n(* comment below!\n\nHI*)",
        "\"foo\"/* comment below!\n\nHI*/"));
    test('block comment above', generateTest(
        "(* comment above!\nHELLO*)\"foo\"",
        "/* comment above!\nHELLO*/\n\"foo\""));
    test('block comment to the right', generateTest(
        '"foo" (* EOL comment *)',
        '"foo"/* EOL comment */'));
});

suite('literals:', function () {
    test('true boolean',   generateTest('true', 'true'));
    test('false boolean',  generateTest('false', 'false'));

    test('null',  generateTest('null', 'null'));

    test('decimal number', generateTest('10', '10'));
    test('negative float', generateTest('-10.51', '-10.51'));
    test('float in exponential notation', generateTest('10.51E+5', '1051e3'));

    test('basic string', generateTest('"Foo bar."', '"Foo bar."'));

    test('single-element list', generateTest('{1}', '[1]'));
    test('complex list',        generateTest('{1, 7, "Beethoven", 4.5}', '[1,7,"Beethoven",4.5]'));

    test('single-element record', generateTest(
        '{ product: "pen" }',
        'new Record({product:"pen"})'));
    test('multi-element record',  generateTest(
        '{product:"pen", price:2.34}',
        'new Record({product:"pen",price:2.34})'));
});

suite('arithmetic expressions:', function () {
    test('multiply',        generateTest('2 * 4', '2*4'));
    test('add',             generateTest('2 + 4', '2+4'));
    test('subtract',        generateTest('2 - 4', '2-4'));
    test('divide with /',   generateTest('2 / 4', '2/4'));
    test('divide with ÷',   generateTest('2 ÷ 4', '2/4'));
    test('integer divide',  generateTest('2 div 4', 'Math.floor(2/4)'));
    test('modulo',          generateTest('2 mod 4', '2%4'));
    test('exponentiation',  generateTest('2^4', 'Math.pow(2,4)'));
});

suite('parenthesized expressions:', function () {
    test('single group',    generateTest('2 * (4 + 2)', '2*(4+2)'));
    test('nested group',    generateTest('(2 * (4 / (3 - 1)))', '2*(4/(3-1))'));
});

suite('logical expressions:', function () {
    test('conjunction', generateTest('a and b', 'a&&b'));
    test('disjunction', generateTest('a or b', 'a||b'));
    test('negation',    generateTest('not a', '!a'));
});

suite('comparison expressions:', function () {
    test('=',           generateTest('a = b', 'a===b'));
    test('equal',       generateTest('a equal b', 'a===b'));
    test('equals',      generateTest('a equals b', 'a===b'));
    test('equal to',    generateTest('a equal to b', 'a===b'));
    test('is equal to', generateTest('a is equal to b', 'a===b'));

    test('is null', generateTest('a is null', 'a===null'));

    test('≠',               generateTest('a ≠ b', 'a!==b'));
    test('is not',          generateTest('a is not b', 'a!==b'));
    test('isn\'t',          generateTest('a isn\'t b', 'a!==b'));
    test('isn\'t equal to', generateTest('a isn\'t equal to b', 'a!==b'));
    test('is not equal to', generateTest('a is not equal to b', 'a!==b'));
    test('doesn\'t equal',  generateTest('a doesn\'t equal b', 'a!==b'));
    test('does not equal',  generateTest('a does not equal b', 'a!==b'));

    test('<',                               generateTest('a < b', 'a<b'));
    test('comes before',                    generateTest('a comes before b', 'a<b'));
    test('less than',                       generateTest('a less than b', 'a<b'));
    test('is less than',                    generateTest('a is less than b', 'a<b'));
    test('is not greater than or equal to', generateTest('a is not greater than or equal to b', 'a<b'));
    test('isn\'t greater than or equal to', generateTest('a isn\'t greater than or equal to b', 'a<b'));

    test('>',                            generateTest('a > b', 'a>b'));
    test('comes after',                  generateTest('a comes after b', 'a>b'));
    test('greater than',                 generateTest('a greater than b', 'a>b'));
    test('is greater than',              generateTest('a is greater than b', 'a>b'));
    test('is not less than or equal to', generateTest('a is not less than or equal to b', 'a>b'));
    test('isn\'t less than or equal to', generateTest('a isn\'t less than or equal to b', 'a>b'));

    test('<=',                       generateTest('a <= b', 'a<=b'));
    test('≤',                        generateTest('a ≤ b', 'a<=b'));
    test('does not come after',      generateTest('a does not come after b', 'a<=b'));
    test('doesn\'t come after',      generateTest('a doesn\'t come after b', 'a<=b'));
    test('is less than or equal to', generateTest('a is less than or equal to b', 'a<=b'));
    test('is not greater than',      generateTest('a is not greater than b', 'a<=b'));
    test('isn\'t greater than',      generateTest('a isn\'t greater than b', 'a<=b'));
    test('less than or equal to',    generateTest('a less than or equal to b', 'a<=b'));

    test('>=',                          generateTest('a >= b', 'a>=b'));
    test('≥',                           generateTest('a ≥ b', 'a>=b'));
    test('does not come before',        generateTest('a does not come before b', 'a>=b'));
    test('doesn\'t come before',        generateTest('a doesn\'t come before b', 'a>=b'));
    test('is greater than or equal to', generateTest('a is greater than or equal to b', 'a>=b'));
    test('is not less than',            generateTest('a is not less than b', 'a>=b'));
    test('isn\'t less than',            generateTest('a isn\'t less than b', 'a>=b'));
    test('greater than or equal to',    generateTest('a greater than or equal to b', 'a>=b'));
});

suite('containment expressions:', function () {
    test('starts with', generateTest('a starts with "foo"', 'a.startsWith("foo")'));
    test('begin with',  generateTest('a begin with "foo"', 'a.startsWith("foo")'));
    test('ends with',   generateTest('a ends with "foo"', 'a.endsWith("foo")'));

    test('contains',        generateTest('a contains "foo"', 'a.contains("foo")'));
    test('is in',           generateTest('a is in "foo"', '"foo".contains(a)'));
    test('is contained by', generateTest('a is contained by "foo"', '"foo".contains(a)'));

    test('does not contain',    generateTest('a does not contain "foo"', '!a.contains("foo")'));
    test('doesn\'t contain',    generateTest('a doesn\'t contain "foo"', '!a.contains("foo")'));
    test('is not in',           generateTest('a is not in "foo"', '!"foo".contains(a)'));
    test('is not contained by', generateTest('a is not contained by "foo"', '!"foo".contains(a)'));
    test('isn\'t contained by', generateTest('a isn\'t contained by "foo"', '!"foo".contains(a)'));
});

suite('concatenation:', function () {
    test('two strings literals',     generateTest('"foo" & "bar"', '"foo"+"bar"'));
    test('one string, one variable', generateTest('a & "bar"', 'a.concat("bar")'));

    test('two lists', generateTest('{1, 2} & {4, 5}', '[1,2].concat([4,5])'));
    test('one variable on left, one list on right', generateTest('a & {4, 5}', 'a.concat([4,5])'));

    test('two records', generateTest('{foo: "bar"} & {bam: "baz"}', 'new Record({foo:"bar"}).concat(new Record({bam:"baz"}))'));
    test('one variable on left, one record on right', generateTest('a & {foo:"bar"}', 'a.concat(new Record({foo:"bar"}))'));
});

suite('variable statement:', function () {
    test('set variable with number literal', 
        generateTest('set a to 5', 'var a=5'));
    test('set variable with string literal', 
        generateTest('set a to "test"', 'var a="test"'));
    test('set variable with boolean literal', 
        generateTest('set a to true', 'var a=true'));
    test('set variable with identifier value', 
        generateTest('set a to b', 'var a=b'));

    test('copy number literal to variable',
        generateTest('copy 5 to a', 'var a=5'));
    test('copy identifier to variable', 
        generateTest('copy a to b', 'var b=a'));
});

suite('if statement:', function () {
    test('simple if without end if', 
        generateTest('if a then b', 'if(a){b}'));
    test('simple if with end if', 
        generateTest('if a then b end if', 'if(a){b}'));
    test('simple if, ommitting unnecessary keywords', 
        generateTest('if a b', 'if(a){b}'));
    test('if with else clause', 
        generateTest('if a then b else c end', 'if(a){b}else{c}'));
    test('if with else if and else clause', 
        generateTest('if a then b else if b then c else d end if', 'if(a){b}else{if(b){c}else{d}}'));
    test('if with multi-statement body', generateTest("if a then\nb\nc\nend if", "if(a){b;c}"));
    test('multiple nested ifs', generateTest("if a then\nif b\nc\nend end if", "if(a){if(b){c}}"));
});

suite('repeat statement:', function () {
    test('repeat without test', 
        generateTest('repeat a end repeat', 'while(true){a}'));
    test('repeat n times', 
        generateTest('repeat 5 times a end', 'for(let n=0;n<5;n++){a}'));
    test('repeat while', 
        generateTest('repeat while a b end', 'while(a){b}'));
    test('repeat until', 
        generateTest('repeat until a b end', 'while(!a){b}'));
    test('repeat with variable from integer to integer', 
        generateTest('repeat with a from 0 to 5 b end', 'for(let a=0;a<5;a++){b}'));
    test('repeat with list', 
        generateTest('repeat with a in {1,2} b end', 'for(a in[1,2]){b}'));
});

suite('positional subroutines:', function () {
    test('simple subroutine with no parameters', generateTest(
        'on helloWorld() return a end',
        'function helloWorld(){return a}'));
    test('simple subroutine with one parameters', generateTest(
        'on helloWorld(a) return a end',
        'function helloWorld(a){return a}'));
    test('simple positional subroutine with a couple parameters', generateTest(
        "on minimumValue(x, y) x end minimumValue",
        "function minimumValue(x,y){x}"));

    test('complex positional subroutine with a couple parameters', generateTest(
        "on minimumValue(x, y)\n"+
            "if x < y then\n" +
            "   return x\n" + 
            "else\n" + 
            "   return y\n" +
            "end if\n" + 
        "end minimumValue",
        'function minimumValue(x,y){if(x<y){return x}else{return y}}'));

    test('call to subroutine with no parameters', generateTest('helloWorld()', 'helloWorld()'));
    test('call to subroutine with one parameter', generateTest('helloWorld (a)', 'helloWorld(a)'));
    test('call to subroutine with several parameters', generateTest('helloWorld(foo, 2+2, "bar")', 'helloWorld(foo,2+2,"bar")'));
});

suite('labelled subroutines:', function () {
    test('simple subroutine with one AS labelled parameter', generateTest(
        "on rock around the clock\n"+
            "return clock\n"+
        "end",
        'function rock(args){var clock=args["around"];return clock}'));

    test('simple subroutine with one direct parameter', generateTest(
        "to findMininum of numList\nnumList\nend findMininum",
        'function findMininum(args){var numList=args["of"];numList}'));
});

suite('properties:', function () {
    test('single property', generateTest("prop name : \"bar\"\n", 'this.name="bar"'));

    test('multiple properties', generateTest(
        "prop name : \"bar\"\n" +
        "property bam : \"baz\"\n" +
        "prop foo : \"bar\"\n",

        'this.name="bar";this.bam="baz";this.foo="bar"'));
});

suite('script objects:', function () {
    test('minimal script object', generateTest(
        'script helloWorld end', 

        'function helloWorld(){}'));

    test('script object with a property', generateTest(
        "script helloWorld \n"+
            "property foo : \"bar\"\n" +
        "end script",
        
        'function helloWorld(){this.foo="bar"}'));
    test('script object with multiple properties', generateTest(
        "script helloWorld \n"+
            "property foo : \"bar\"\n" +
            "property bam : \"baz\"\n" +
            "property bar : \"bao\"\n" +
        "end",
        
        'function helloWorld(){this.foo="bar";this.bam="baz";this.bar="bao"}'));

    test('script object with a handler', generateTest(
        "script helloWorld\n" +
            "on sayHello()\n" +
            "   return 'Hello'\n" +
            "end sayHello\n" +
        "end",

        "function helloWorld(){"+
            "this.sayHello=function sayHello(){"+
                "return\"Hello\""+
            "}"+
        "}"));

    test('script object with a handler and a property', generateTest(
       "script helloWorld\n" +
            "prop HowManyTimes:0\n" +
            "on sayHello(someone)\n" +
            "   return 'Hello'\n" +
            "end\n" +
       "end",

       "function helloWorld(){"+
            "this.HowManyTimes=0;"+
            "this.sayHello=function sayHello(someone){"+
                "return\"Hello\""+
            "}"+
        "}"));

    test('script object with implicit run statement', generateTest(
        "script helloWorld\n" +
            "property HowManyTimes:0\n" +
            "   return 'Hello'\n" +
        "end",
        
        "function helloWorld(){"+
            "this.HowManyTimes=0;"+
            "this.run=function run(){"+
                "return\"Hello\""+
            "}"+
        "}"));
});
