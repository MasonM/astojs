'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class ReturnStatement extends Node {
    constructor(argument) {
        super();
        this.type = "ReturnStatement";
        this.argument = argument;
        if (argument) this.argument.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        if (this.argument) this.argument = this.argument.codegen();
        return this;
    }
}

module.exports.ReturnStatement = ReturnStatement;
