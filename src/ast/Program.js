'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

class Program extends Node {
    constructor(body) {
        super();
        this.type = "Program";
        this.body = (body === null) ? null : body.map(function(statement) {
            if (statement) {
                statement.parent = this;
                return statement;
            } else {
                return { type: 'EmptyStatement' };
            }
        });
    }

    codegen() {
        if (!super.codegen()) return;
        for (var i = 0; i < this.body.length;) {
            var statement = this.body[i];

            if (!statement || statement.codeGenerated) {
                i++;
            } else if (statement.codegen && statement.codegen()) {
                this.body[this.body.indexOf(statement)] = statement;
                i++;
            } else {
                this.body.splice(i, 1);
            }
        }

        return this;
    }
}

module.exports.Program = Program;
