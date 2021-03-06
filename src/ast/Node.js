'use strict';

var appRoot = require('app-root-path');

class Node {
    constructor() {
        this.codeGenerated = false;
        this.definedIdentifiers = [];
        Object.defineProperty(this, 'parent', {
            value: null,
            writable: true,
            configurable: true,
            enumerable: false
        });
    }

    blockWrap() {
        if (this.type == 'BlockStatement') {
            return this;
        }

        var myParent = this.parent;
        // this require() cannot go to the top because of the circular dependency
        var blockStatement = require(appRoot + '/src/ast/statements/BlockStatement');
        var block = new blockStatement.BlockStatement([this]);
        block.parent = myParent;

        return block;
    }

    transformToESTree() {
        if (this.codeGenerated) {
            return false;
        }

        this.codeGenerated = true;
        return this._transformToESTree ? this._transformToESTree() : this;
    }

    assignObjectProperty(name, value) {
        return {
            "type": "ExpressionStatement",
            "range": this.range,
            "expression": {
                "type": "AssignmentExpression",
                "range": this.range,
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "range": this.range,
                    "object": {
                        "type": "ThisExpression",
                        "range": this.range,
                    },
                    "property": name
                },
                "right": value
            }
        }
    }
}


module.exports.Node = Node;
