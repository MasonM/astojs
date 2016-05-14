'use strict';
var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

class SubroutineLabelledDeclarationStatement extends Node {
    constructor(id, directParam, asLabelledParams, userLabelledParams, body) {
        super();
        this.type = "SubroutineLabelledDeclaration";
        this.defaults = [];
        this.rest = null;
        this.generator = false;
        this.expression = false;

        this.id = id;
        this.id.parent = this;

        this.directParam = directParam;
        if (directParam) directParam.parent = this;

        this.body = body;
        this.body.parent = this;

        this.asLabelledParams = asLabelledParams ? asLabelledParams : [];
        this.userLabelledParams = userLabelledParams ? userLabelledParams : [];

        var self = this;
        if (asLabelledParams) {
            _(asLabelledParams).each(function(p) {
                p.parent = self;
            });
        }
        if (userLabelledParams) {
            _(userLabelledParams).each(function(p) {
                p.parent = self;
            });
        }
    }

    _transformToESTree() {
        this.type = 'FunctionDeclaration';
        this.id = this.id.transformToESTree();
        this.body = this.body.transformToESTree();
        this.params = [{
            "type": "Identifier",
                "name": "args"
        }];
        if (this.directParam) this.directParam = this.directParam.transformToESTree();

        var paramAssignments = [];
        if (this.directParam) {
            paramAssignments.push(this.getVariableDeclaratorForParam(this.directParam));
        }
        for (var i = 0; i < this.asLabelledParams.length; i++) {
            this.asLabelledParams[i] = this.asLabelledParams[i].transformToESTree();
            paramAssignments.push(this.getVariableDeclaratorForParam(this.asLabelledParams[i]));
        }
        for (var i = 0; i < this.userLabelledParams.length; i++) {
            this.userLabelledParams[i] = this.userLabelledParams[i].transformToESTree();
            paramAssignments.push(this.getVariableDeclaratorForParam(this.userLabelledParams[i]));
        }
        this.body.body.unshift({
            "type": "VariableDeclaration",
            "declarations": paramAssignments,
            "kind": "var"
        });
        return this;
    }

    getVariableDeclaratorForParam(param) {
        return {
            "type": "VariableDeclarator",
            "id": param.id,
            "init": {
                "type": "MemberExpression",
                "computed": true,
                "object": {
                    "type": "Identifier",
                    "name": "args",
                },
                "property": {
                    "type": "Literal",
                    "value": param.label
                }
            }
        };
    }
}

module.exports.SubroutineLabelledDeclarationStatement = SubroutineLabelledDeclarationStatement;
