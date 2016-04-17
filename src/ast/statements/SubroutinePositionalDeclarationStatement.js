var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function SubroutinePositionalDeclarationStatement(id, params, body) {
    Node.call(this);
    this.type = "SubroutinePositionalDeclaration";
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.expression = false;

    this.id = id;
    this.id.parent = this;

    this.body = body;
    this.body.parent = this;

    this.params = params;
    var self = this;
    _(params).each(function(p) {
        p.parent = self;
    });
}

SubroutinePositionalDeclarationStatement.prototype = Object.create(Node);

SubroutinePositionalDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    this.type = 'FunctionDeclaration';
    this.id = this.id.codegen();
    this.body = this.body.codegen();
    for (var i = 0; i < this.params.length; i++) {
        this.params[i] = this.params[i].codegen();
    }
    return this;
};

exports.SubroutinePositionalDeclarationStatement = SubroutinePositionalDeclarationStatement;
