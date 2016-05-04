'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class VariableDeclarationStatement extends Node {
    constructor(id, init) {
        super();
        this.type = "VariableDeclaration";
        this.kind = "var";
        this.id = id;
        this.id.parent = this;

        this.init = init;
        if (init) this.init.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.id = this.id.codegen();
        if (this.init) this.init = this.init.codegen();

        this.declarations = [{
            "type": "VariableDeclarator",
                "id": this.id,
                "init": this.init
        }];
        return this;
    }
}

module.exports.VariableDeclarationStatement = VariableDeclarationStatement;
