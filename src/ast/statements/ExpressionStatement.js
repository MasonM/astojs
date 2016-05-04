'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class ExpressionStatement extends Node {
    constructor(expression) {
        super();
        this.type = "ExpressionStatement";
        this.expression = expression;
        this.expression.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.expression = this.expression.codegen();
        return this;
    }
}

module.exports.ExpressionStatement = ExpressionStatement;
