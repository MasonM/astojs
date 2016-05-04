'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class NullLiteral extends Node {
    constructor(text) {
        super();
        this.type = "Literal";
        this.value = null;
        this.raw = text;
    }
}

module.exports.NullLiteral = NullLiteral;
