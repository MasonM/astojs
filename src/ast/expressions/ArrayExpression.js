'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class ArrayExpression extends Node {
    constructor(elements) {
        super();
        this.type = 'ArrayExpression';
        this.elements = elements;

        var self = this;
        _(elements).each(function(element) { if (element) element.parent = self; });
    }

    _codegen() {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i]) this.elements[i] = this.elements[i].codegen();
        }
        return this;
    }
}

module.exports.ArrayExpression = ArrayExpression;
