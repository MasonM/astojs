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

    _codegen() {
        this.test = this.test.codegen();
        this.consequent = this.consequent.blockWrap().codegen();
        if (this.alternate) this.alternate = this.alternate.blockWrap().codegen();
        return this;
    }
}

module.exports.IfStatement = IfStatement;
