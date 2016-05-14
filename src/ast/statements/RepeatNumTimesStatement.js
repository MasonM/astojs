'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatNumTimesStatement extends Node {
    constructor(num, body) {
        super();
        this.type = "RepeatNumTimesStatement";
        this.num = num;
        this.body = body;
        this.body.parent = this;
    }

    _transformToESTree() {
        this.type = "ForStatement";
        var id = {
            "type": "Identifier",
            "name": "n" // @hack Probably should be smarter about this
        };
        this.init = {
            "type": "VariableDeclaration",
            "declarations": [{
                "type": "VariableDeclarator",
                "id": id,
                "init": { "type": "Literal", "value": 0 }
            }],
            "kind": "let",
            "codeGenerated": true
        };
        this.test = {
            "type": "BinaryExpression",
            "operator": "<",
            "left": id,
            "right": this.num
        };
        this.update = {
            "type": "UpdateExpression",
            "operator": "++",
            "prefix": false,
            "argument": id,
        };
        this.body = this.body.blockWrap().transformToESTree();
        return this;
    }
}

module.exports.RepeatNumTimesStatement = RepeatNumTimesStatement;
