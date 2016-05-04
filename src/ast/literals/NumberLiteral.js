'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class NumberLiteral extends Node {
    constructor(text) {
        super();
        this.type = "Literal";
        this.value = Number(text);
        this.raw = text;
    }
}

module.exports.NumberLiteral = NumberLiteral;
