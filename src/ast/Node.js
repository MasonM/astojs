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
        var blockStatement = require(appRoot + '/src/ast/statements/BlockStatement');
        var block = new blockStatement.BlockStatement([this]);
        block.parent = myParent;

        return block;
    }

    codegen() {
        if (this.codeGenerated) {
            return false;
        }

        this.codeGenerated = true;
        return this._codegen ? this._codegen() : this;
    }

    static assignObjectProperty(name, value) {
        return {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "ThisExpression"
                    },
                    "property": name
                },
                "right": value
            }
        }
    }
}


module.exports.Node = Node;
