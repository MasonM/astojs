'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class CoercionExpression extends Node {
    constructor(argument, coercionClass) {
        super();
        this.type = "CoercionExpression";
        this.argument = argument;
        this.argument.parent = this;
        this.coercionClass = coercionClass;
    }

    _transformToESTree() {
        this.argument = this.argument.transformToESTree();
        switch (this.coercionClass) {
        }
        return this;
    }
}

module.exports.CoercionExpression = CoercionExpression;
