'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class LogicalExpression extends Node {
    constructor(left, operator, right) {
        super();
        this.type = 'LogicalExpression';
        this.operator = operator;

        this.left = left;
        this.left.parent = this;

        this.right = right;
        this.right.parent = this;
    }

    _transformToESTree() {
        this.left = this.left.transformToESTree();
        this.right = this.right.transformToESTree();
        return this;
    }
}

module.exports.LogicalExpression = LogicalExpression;
