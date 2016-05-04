'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class BooleanLiteral extends Node {
    constructor(text) {
        super();
        this.type = "Literal";
        this.value = text === "true";
        this.raw = text;
    }
}

module.exports.BooleanLiteral = BooleanLiteral;
