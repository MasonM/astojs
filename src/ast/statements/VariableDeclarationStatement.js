var Node = module.require("../Node").Node,
    _ = require('underscore');

function VariableDeclarationStatement(declarations) {
    Node.call(this);
    this.type = "VariableDeclaration";
    this.kind = "var";
    this.declarations = declarations;

    var self = this;
    _(declarations).each(function(d) {
        d.parent = self;
    });
}

VariableDeclarationStatement.prototype = Object.create(Node);

VariableDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    for (var i = 0; i < this.declarations.length; i++) {
        var statement = this.declarations[i].codegen();
        if (statement) {
            this.declarations[this.declarations.indexOf(statement)] = statement;
        }
    }
    return this;
};

exports.VariableDeclarationStatement = VariableDeclarationStatement;
