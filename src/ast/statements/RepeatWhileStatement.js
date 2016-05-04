'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatWhileStatement extends Node {
    constructor(test, body) {
        super();
        this.type = "RepeatWhileStatement";
        this.test = test;
        this.test.parent = this;

        this.body = body;
        this.body.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.type = "WhileStatement";
        this.body = this.body.blockWrap().codegen();
        return this;
    }
}

module.exports.RepeatWhileStatement = RepeatWhileStatement;
