'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class RecordExpression extends Node {
    constructor(properties) {
        super();
        this.type = "RecordExpression";
        this.properties = properties;

        var self = this;
        _(properties).each(function(property) { property.parent = self; });
    }

    _transformToESTree() {
        this.type = 'NewExpression';
        this.callee = {
            "type": "Identifier",
            "name": "Record"
        }
        for (var i = 0; i < this.properties.length; i++) {
            this.properties[i] = this.properties[i].transformToESTree();
        }
        Object.defineProperty(this, 'arguments', {
            value: [{ "type": "ObjectExpression", "properties": this.properties }],
            enumerable: true
        });
        return this;
    }
}

module.exports.RecordExpression = RecordExpression;
