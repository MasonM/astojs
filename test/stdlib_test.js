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
