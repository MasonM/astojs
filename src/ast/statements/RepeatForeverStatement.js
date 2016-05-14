'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatForeverStatement extends Node {
    constructor(body) {
        super();
        this.type = "RepeatForeverStatement";
        this.body = body;
        this.body.parent = this;
    }

    _transformToESTree() {
        this.type = "WhileStatement";
        this.test = {
            "type": "Literal",
            "value": true,
            "codeGenerated": true
        };
        this.body = this.body.blockWrap().transformToESTree();
        return this;
    }
}

module.exports.RepeatForeverStatement = RepeatForeverStatement;
