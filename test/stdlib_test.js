/*global describe,it*/
'use strict';

var should = require('should'),
    stdlib = require('../src/stdlib'),
    util = require('util');

describe('basic record test:', function () {
    var testRecord = new stdlib.Record({foo: "bar", bam: "baz"});
    var testRecord2 = new stdlib.Record({foo2: "bar2", bam: "baz2"});
    it("can access property", function() {
        should(testRecord['foo']).equal('bar');
        should(testRecord['bam']).equal('baz');
        (testRecord['foo2'] === undefined).should.be.true;
    });

    it("concat", function() {
        var testRecord3 = testRecord.concat(testRecord2);
        should(testRecord3['foo']).equal('bar');
        should(testRecord3['bam']).equal('baz2');
        should(testRecord3['foo2']).equal('bar2');
    });

    it("equals", function() {
        var testRecordCopy = new stdlib.Record({foo: "bar", bam: "baz"});
        testRecord.equals(testRecord2).should.be.false;
        testRecord.equals(testRecord).should.be.true;
        testRecord.equals(testRecordCopy).should.be.true;
        testRecord['foo2'] = 'bar2';
        testRecord.equals(testRecordCopy).should.be.false;
    });
});

describe('array containment test:', function () {
    var testArray1 = ["foo", 2, "bar"];
    it("startWith using a string", function() {
        testArray1.startsWith("foo").should.be.true;
        testArray1.startsWith("bar").should.be.false;
    });

    it("startWith using an array", function() {
        testArray1.startsWith(["foo", 2, "bar"]).should.be.true;
        testArray1.startsWith(["foo", 2]).should.be.true;
        testArray1.startsWith(["foo"]).should.be.true;

        testArray1.startsWith(["bar"]).should.be.false;
        testArray1.startsWith(["foo", 2, "bar", 4]).should.be.false;
    });

    it("endsWith using a string", function() {
        testArray1.endsWith("bar").should.be.true;
        testArray1.endsWith("foo").should.be.false;
    });

    it("endsWith using an array", function() {
        testArray1.endsWith(["bar"]).should.be.true;
        testArray1.endsWith([2, "bar"]).should.be.true;
        testArray1.endsWith(["foo", 2, "bar"]).should.be.true;

        testArray1.endsWith(["foo"]).should.be.false;
        testArray1.endsWith([2, "foo", 2, "foo"]).should.be.false;
    });
});
