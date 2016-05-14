'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class UnaryExpression extends Node {
    constructor(operator, argument) {
        super();
        this.type = "UnaryExpression";
        this.operator = operator;
        this.argument = argument;
        this.argument.parent = this;
        this.prefix = true;
    }

    _transformToESTree() {
        this.argument = this.argument.transformToESTree();
        return this;
    }
}

module.exports.UnaryExpression = UnaryExpression;
