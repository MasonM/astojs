'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatListStatement extends Node {
    constructor(loopVariable, list, body) {
        super();
        this.loopVariable = loopVariable;
        this.loopVariable.parent = this;

        this.list = list;
        this.list.parent = this;

        this.body = body;
        this.body.parent = this;
    }

    _transformToESTree() {
        this.type = "ForInStatement";
        this.left = this.loopVariable.transformToESTree();
        this.right = this.list.transformToESTree();
        this.body = this.body.blockWrap().transformToESTree();
        return this;
    }
}

module.exports.RepeatListStatement = RepeatListStatement;
