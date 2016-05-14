'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class IfStatement extends Node {
    constructor(test, consequent, alternate) {
        super();
        this.type = "IfStatement";
        this.test = test;
        this.test.parent = this;

        this.consequent = consequent;
        this.consequent.parent = this;

        this.alternate = alternate;
        if (this.alternate) this.alternate.parent = this;
    }

    _transformToESTree() {
        this.test = this.test.transformToESTree();
        this.consequent = this.consequent.blockWrap().transformToESTree();
        if (this.alternate) this.alternate = this.alternate.blockWrap().transformToESTree();
        return this;
    }
}

module.exports.IfStatement = IfStatement;
