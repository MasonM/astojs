'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class LabelledParameter extends Node {
    constructor(label, id) {
        super();
        this.type = "LabelledParameter";
        this.label = label;
        this.id = id;
        this.id.parent = this;
    }

    _transformToESTree() {
        this.type = "Identifier";
        this.id = this.id.transformToESTree();
        return this;
    }
}

module.exports.LabelledParameter = LabelledParameter;
