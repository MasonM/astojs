var Node = module.require("../Node").Node,
    _ = require('underscore');

function SubroutineLabelledDeclarationStatement(id, directParam, asLabelledParams, userLabelledParams, body) {
    Node.call(this);
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

SubroutineLabelledDeclarationStatement.prototype = Object.create(Node);

SubroutineLabelledDeclarationStatement.prototype.getVariableDeclaratorForParam = function(param) {
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

SubroutineLabelledDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    this.type = 'FunctionDeclaration';
    this.id = this.id.codegen();
    this.body = this.body.codegen();
    this.params = [{
        "type": "Identifier",
        "name": "args"
    }];
    if (this.directParam) this.directParam = this.directParam.codegen();

    var paramAssignments = [];
    if (this.directParam) {
        paramAssignments.push(this.getVariableDeclaratorForParam(this.directParam));
    }
    for (var i = 0; i < this.asLabelledParams.length; i++) {
        this.asLabelledParams[i] = this.asLabelledParams[i].codegen();
        paramAssignments.push(this.getVariableDeclaratorForParam(this.asLabelledParams[i]));
    }
    for (var i = 0; i < this.userLabelledParams.length; i++) {
        this.userLabelledParams[i] = this.userLabelledParams[i].codegen();
        paramAssignments.push(this.getVariableDeclaratorForParam(this.userLabelledParams[i]));
    }
    this.body.body.unshift({
        "type": "VariableDeclaration",
        "declarations": paramAssignments,
        "kind": "var"
    });
    return this;
};

exports.SubroutineLabelledDeclarationStatement = SubroutineLabelledDeclarationStatement;
