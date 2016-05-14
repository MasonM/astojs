'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class BlockStatement extends Node {
    constructor(body) {
        super();
        this.type = 'BlockStatement';
        this.body = body;

        var self = this;
        _(body).each(function(statement) {
            if (statement) {
                statement.parent = self;
            } else {
                body[i] = { type: 'EmptyStatement' };
            }
        });
    }

    _transformToESTree() {
        for (var i = 0; i < this.body.length;) {
            var statement = this.body[i];

            if (!statement || statement.codeGenerated) {
                i++;
                continue;
            } else if (statement && statement.transformToESTree()) {
                this.body[this.body.indexOf(statement)] = statement;
                i++;
            } else {
                this.body.splice(i, 1);
            }
        }
        return this;
    }
}

module.exports.BlockStatement = BlockStatement;
