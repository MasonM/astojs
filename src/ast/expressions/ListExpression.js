'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class ListExpression extends Node {
    constructor(items) {
        super();
        this.type = 'ListExpression';
        this.items = items;
        _(items).each(item => { if (item) item.parent = this; });
    }

    _transformToESTree() {
        this.type = 'ArrayExpression';
        this.elements = _(this.items).compact().map(item => item.transformToESTree())
        return this;
    }
}

module.exports.ListExpression = ListExpression;
