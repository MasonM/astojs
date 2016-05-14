'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class PositionalCallExpression extends Node {
    constructor(callee, args) {
        super();
        this.type = "PositionalCallExpression";
        this.callee = callee;
        this.callee.parent = this;

        Object.defineProperty(this, 'arguments', {
            value: args,
            enumerable: true
        });

        var self = this;
        _(args).each(function(arg) { if (arg) arg.parent = self; });
    }

    _transformToESTree() {
        this.type = "CallExpression";
        this.callee = this.callee.transformToESTree();
        for (var i = 0; i < this.arguments.length; i++) {
            if (this.arguments[i]) this.arguments[i] = this.arguments[i].transformToESTree();
        }
        return this;
    }
}

module.exports.PositionalCallExpression = PositionalCallExpression;
