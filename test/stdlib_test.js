/*global describe,it*/
'use strict';

var should = require('should'),
    stdlib = require('../src/stdlib'),
    util = require('util');

suite('basic record test:', function () {
    var testRecord = new stdlib.Record({foo: "bar", bam: "baz"});
    var testRecord2 = new stdlib.Record({foo2: "bar2", bam: "baz2"});
    test("can access property", function() {
        should(testRecord['foo']).equal('bar');
        should(testRecord['bam']).equal('baz');
        (testRecord['foo2'] === undefined).should.be.true;
    });

    test("concat", function() {
        var testRecord3 = testRecord.concat(testRecord2);
        should(testRecord3['foo']).equal('bar');
        should(testRecord3['bam']).equal('baz2');
        should(testRecord3['foo2']).equal('bar2');
    });

    test("equals", function() {
        var testRecordCopy = new stdlib.Record({foo: "bar", bam: "baz"});
        testRecord.equals(testRecord2).should.be.false;
        testRecord.equals(testRecord).should.be.true;
        testRecord.equals(testRecordCopy).should.be.true;
        testRecord['foo2'] = 'bar2';
        testRecord.equals(testRecordCopy).should.be.false;
    });
});

suite('array containment test:', function () {
    var testArray1 = ["foo", 2, "bar"];
    test("contains using a string", function() {
        testArray1.contains("foo").should.be.true;
        testArray1.contains(2).should.be.true;
        testArray1.contains("baz").should.be.false;
    });

    test("contains using another array", function() {
        testArray1.contains([2]).should.be.true;
        testArray1.contains(["foo", 2]).should.be.true;
        testArray1.contains([2, "bar"]).should.be.true;
        testArray1.contains(["foo", 2, "bar"]).should.be.true;
        testArray1.contains(["bar", 2]).should.be.false;
        testArray1.contains(["foo", 2, "baz"]).should.be.false;
    });

    test("startWith using a string", function() {
        testArray1.startsWith("foo").should.be.true;
        testArray1.startsWith("bar").should.be.false;
    });

    test("startWith using an array", function() {
        testArray1.startsWith(["foo", 2, "bar"]).should.be.true;
        testArray1.startsWith(["foo", 2]).should.be.true;
        testArray1.startsWith(["foo"]).should.be.true;

        testArray1.startsWith(["bar"]).should.be.false;
        testArray1.startsWith(["foo", 2, "bar", 4]).should.be.false;
    });

    test("endsWith using a string", function() {
        testArray1.endsWith("bar").should.be.true;
        testArray1.endsWith("foo").should.be.false;
    });

    test("endsWith using an array", function() {
        testArray1.endsWith(["bar"]).should.be.true;
        testArray1.endsWith([2, "bar"]).should.be.true;
        testArray1.endsWith(["foo", 2, "bar"]).should.be.true;

        testArray1.endsWith(["foo"]).should.be.false;
        testArray1.endsWith([2, "foo", 2, "foo"]).should.be.false;
    });
});

suite('record containment test:', function () {
    var testRecord = new stdlib.Record({foo: "bar", bam: "baz"});
    test("contains using a single-element record", function() {
        testRecord.contains(new stdlib.Record({foo: "bar"})).should.be.true;
        testRecord.contains(new stdlib.Record({bam: "baz"})).should.be.true;
        testRecord.contains(new stdlib.Record({foo: "baz"})).should.be.false;
    });

    test("contains using a multi-element record", function() {
        testRecord.contains(new stdlib.Record({foo: "bar", bam: "baz"})).should.be.true;
        testRecord.contains(new stdlib.Record({bam: "baz", foo: "bar"})).should.be.true;
        testRecord.contains(new stdlib.Record({foo: "bar", bam: "baz", bat: "bas"})).should.be.false;
        testRecord.contains(new stdlib.Record({foo: "bar", bam: "bas"})).should.be.false;
    });
});
