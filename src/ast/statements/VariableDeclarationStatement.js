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

    _transformToESTree() {
        this.id = this.id.transformToESTree();
        if (this.init) this.init = this.init.transformToESTree();

        this.declarations = [{
            "type": "VariableDeclarator",
                "id": this.id,
                "init": this.init
        }];
        return this;
    }
}

module.exports.VariableDeclarationStatement = VariableDeclarationStatement;
