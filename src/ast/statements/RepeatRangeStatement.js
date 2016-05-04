'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatRangeStatement extends Node {
    constructor(loopVariable, start, end, step, body) {
        super();
        this.type = "RepeatRangeStatement";
        this.loopVariable = loopVariable;
        this.loopVariable.parent = this;
        this.start = start;
        this.end = end;
        this.step = step ? step : 1;
        this.body = body;
        this.body.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.type = "ForStatement";
        this.init = {
            "type": "VariableDeclaration",
            "declarations": [{
                "type": "VariableDeclarator",
                "id": this.loopVariable,
                "init": this.start,
            }],
            "kind": "let",
            "codeGenerated": true
        };
        this.test = {
            "type": "BinaryExpression",
            "operator": "<",
            "left": this.loopVariable,
            "right": this.end
        };
        if (this.step === 1) {
            this.update = {
                "type": "UpdateExpression",
                "operator": "++",
                "prefix": false,
                "argument": this.loopVariable,
            };
        } else {
            this.update = {
                "type": "AssignmentExpression",
                "operator": "+=",
                "left": id,
                "right": this.step,
            };
        }
        this.loopVariable = this.loopVariable.codegen();
        this.body = this.body.blockWrap().codegen();
        return this;
    }
}

module.exports.RepeatRangeStatement = RepeatRangeStatement;
