'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RepeatListStatement extends Node {
    constructor(loopVariable, list, body) {
        super();
        this.loopVariable = loopVariable;
        this.loopVariable.parent = this;

        this.list = list;
        this.list.parent = this;

        this.body = body;
        this.body.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.type = "ForInStatement";
        this.left = this.loopVariable;
        this.right = this.list;
        this.body = this.body.blockWrap().codegen();
        return this;
    }
}

module.exports.RepeatListStatement = RepeatListStatement;
