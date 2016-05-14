'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    StringLiteral = require(appRoot + "/src/ast/literals/StringLiteral").StringLiteral,
    ListExpression = require(appRoot + "/src/ast/expressions/ListExpression").ListExpression;

class BinaryExpression extends Node {
    constructor(left, operator, right) {
        super();
        this.type = 'BinaryExpression';
        this.operator = operator;

        this.left = left;
        this.left.parent = this;

        this.right = right;
        this.right.parent = this;
    }

    _transformToESTree() {
        var leftType = this.left.type,
            rightType = this.right.type;
        this.left = this.left.transformToESTree();
        this.right = this.right.transformToESTree();
        switch (this.operator) {
            case "÷":
                this.operator = '/';
                break;
            case "div":
                this.type = 'CallExpression';
                this.callee = {
                    "type": "MemberExpression",
                    "computed": false,
                    "range": this.range,
                    "object": {
                        "type": "Identifier",
                        "name": "Math"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "floor"
                    }
                };
                Object.defineProperty(this, 'arguments', {
                    value: [{
                        "type": "BinaryExpression",
                        "operator": "/",
                        "range": this.range,
                        "left": this.left,
                        "right": this.right
                    }],
                    enumerable: true
                });
                break;
            case "mod":
                this.operator = "%";
                break;
            case "comes before":
            case "less than":
            case "is less than":
            case "is not greater than or equal":
            case "is not greater than or equal to":
            case "isn't greater than or equal":
            case "isn't greater than or equal to":
                this.operator = "<";
                break;
            case "comes after":
            case "greater than":
            case "is greater than":
            case "is not less than or equal":
            case "is not less than or equal to":
            case "isn't less than or equal":
            case "isn't less than or equal to":
                this.operator = ">";
                break;
            case "≤":
            case "does not come after":
            case "doesn't come after":
            case "is less than or equal to":
            case "is less than or equal":
            case "is not greater than":
            case "isn't greater than":
            case "less than or equal to":
            case "less than or equal":
                this.operator = "<=";
                break;
            case "≥":
            case "does not come before":
            case "doesn't come before":
            case "greater than or equal to":
            case "greater than or equal":
            case "is greater than or equal to":
            case "is greater than or equal":
            case "is not less than":
            case "isn't less than":
                this.operator = ">=";
                break;
            case "=":
            case "equals":
            case "equal to":
            case "equal":
            case "is equal to":
            case "is equal":
            case "is":
                this.operator = "===";
                break;
            case "≠":
            case "is not":
            case "is not equal to":
            case "isn't":
            case "isn't equal to":
            case "isn't equal":
            case "doesn't equal":
            case "does not equal":
                this.operator = "!==";
                break;
            case "contains":
                this.type = 'CallExpression';
                this.callee = {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": this.left,
                    "range": this.range,
                    "property": {
                        "type": "Identifier",
                        "name": "contains"
                    }
                };
                Object.defineProperty(this, 'arguments', {
                    value: [ this.right ]
                });
                break;
            case "is in":
            case "is contained by":
                this.type = 'CallExpression';
                this.callee = {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": this.right,
                    "range": this.range,
                    "property": {
                        "type": "Identifier",
                        "name": "contains"
                    }
                };
                Object.defineProperty(this, 'arguments', {
                    value: [ this.left ]
                });
                break;
            case "does not contain":
            case "doesn't contain":
                this.type = "UnaryExpression";
                this.operator = "!";
                this.prefix = true;
                this.argument = {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "range": this.range,
                        "object": this.left,
                        "property": {
                            "type": "Identifier",
                            "name": "contains",
                        }
                    },
                    "arguments": [this.right]
                };
                break; 
            case "is not in":
            case "is not contained by":
            case "isn't contained by":
                this.type = "UnaryExpression";
                this.operator = "!";
                this.prefix = true;
                this.argument = {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": this.right,
                        "range": this.range,
                        "property": {
                            "type": "Identifier",
                            "name": "contains",
                        }
                    },
                    "arguments": [this.left]
                };
                break; 
            case "^":
                this.type = 'CallExpression';
                this.callee = {
                    "type": "MemberExpression",
                    "computed": false,
                    "range": this.range,
                    "object": {
                        "type": "Identifier",
                        "name": "Math"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "pow"
                    }
                };
                Object.defineProperty(this, 'arguments', {
                    value: [this.left, this.right],
                    enumerable: true
                });
                break;
            case "&":
                if (leftType === "StringLiteral") {
                    this.operator = "+";
                } else {
                    this.type = 'CallExpression';
                    this.callee = {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": this.left,
                        "range": this.range,
                        "property": {
                            "type": "Identifier",
                            "name": "concat"
                        }
                    };
                    Object.defineProperty(this, 'arguments', {
                        value: [ this.right ]
                    });
                }
                break;
        }
        return this;
    }
}

module.exports.BinaryExpression = BinaryExpression;
