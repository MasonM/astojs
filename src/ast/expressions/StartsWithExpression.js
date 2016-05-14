'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class StartsWithExpression extends Node {
    constructor(left, right) {
        super();
        this.type = 'StartsWithExpression';

        this.left = left;
        this.left.parent = this;

        this.right = right;
        this.right.parent = this;
    }

    _transformToESTree() {
        this.left = this.left.transformToESTree();
        this.right = this.right.transformToESTree();
        this.type = 'CallExpression';
        this.callee = {
            "type": "MemberExpression",
            "computed": false,
            "object": this.left,
            "property": {
                "type": "Identifier",
                "name": "startsWith"
            }
        };
        Object.defineProperty(this, 'arguments', {
            value: [ this.right ]
        });
        return this;
    }
}

module.exports.StartsWithExpression = StartsWithExpression;
