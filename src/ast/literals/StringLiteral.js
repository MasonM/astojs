'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class StringLiteral extends Node {
    constructor(chars, column) {
        super();
        this.type = "StringLiteral";

        this.chars = chars;
        this.column = column;
    }

    _codegen() {
        var elements = [];
        _(this.chars).each(function(value) {
            var lastElement;

            if (typeof value === 'string') {
                lastElement = elements[elements.length - 1];
                if (lastElement && lastElement.type === 'Literal') {
                    lastElement.value += value;
                } else {
                    elements.push({
                        type: 'Literal',
                        value: value
                    });
                }
            } else if (value && value.type == "StringLiteralNewLine") {
                lastElement = elements[elements.length - 1];
                if (lastElement && lastElement.type == 'Literal') {
                    lastElement.value += value.toString(this.column - 1);
                } else {
                    elements.push({
                        type: 'Literal',
                        value: value.toString(this.column - 1)
                    });
                }
            } else {
                value.parent = this;
                elements.push(value.codegen());
            }
        });

        if (elements.length === 0) {
            return {
                "type": "Literal",
                "value": ""
            };
        } else if (elements.length === 1) {
            return elements[0];
        }

        var reduced = elements.reduce(function(left, right) {
            return {
                type: 'BinaryExpression',
                operator: '+',
                left: left,
                right: right
            };
        });

        this.type = reduced.type;
        this.operator = reduced.operator;
        this.left = reduced.left;
        this.right = reduced.right;
        return this;
    }
}

module.exports.StringLiteral = StringLiteral;
