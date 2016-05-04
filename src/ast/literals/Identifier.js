'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class Identifier extends Node {
    constructor(name) {
        super();
        this.type = "Identifier";
        this.global = false;
        Object.defineProperty(this, 'name', {
            value: name,
            enumerable: true,
        });
    }
}

module.exports.Identifier = Identifier;
