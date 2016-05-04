'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class ScriptPropertyStatement extends Node {
    constructor(label, initialValue) {
        super();
        this.type = "Property";
        this.label = label;
        this.label.parent = this;
        this.initialValue = initialValue;
        this.initialValue.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.type = "VariableDeclarator";
        this.id = this.label.codegen();
        this.init = this.initialValue.codegen();
        if (!this.parent || this.parent.type !== "FunctionDeclaration") {
            // top-level script property
            Object.assign(this, Node.assignObjectProperty(this.id, this.init));
        }
        return this;
    }
}

module.exports.ScriptPropertyStatement = ScriptPropertyStatement;
