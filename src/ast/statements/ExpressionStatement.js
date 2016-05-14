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

    _transformToESTree() {
        this.expression = this.expression.transformToESTree();
        return this;
    }
}

module.exports.ExpressionStatement = ExpressionStatement;
