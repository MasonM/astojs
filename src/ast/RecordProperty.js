'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class RecordProperty extends Node {
    constructor(key, value, shorthand, method) {
        super();
        this.type = "Property";
        this.kind = 'init';
        this.method = method;
        this.shorthand = shorthand;
        this.computed = false;

        this.key = key;
        this.key.parent = this;

        this.value = value;
        this.value.parent = this;
    }

    codegen() {
        if (!super.codegen()) return;
        this.key = this.key.codegen(false);
        this.value = this.value.codegen(this.parent.type != "ObjectPattern");
        return this;
    }
}

module.exports.RecordProperty = RecordProperty;
