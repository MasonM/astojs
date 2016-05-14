'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatUntilStatement extends Node {
    constructor(test, body) {
        super();
        this.type = "RepeatUntilStatement";
        this.test = test;
        this.test.parent = this;

        this.body = body;
        this.body.parent = this;
    }

    _transformToESTree() {
        this.type = "WhileStatement";
        this.test = {
            type: "UnaryExpression",
            operator: "!",
            prefix: true,
            argument: this.test
        };
        this.body = this.body.blockWrap().transformToESTree();
        return this;
    }
}

module.exports.RepeatUntilStatement = RepeatUntilStatement;
