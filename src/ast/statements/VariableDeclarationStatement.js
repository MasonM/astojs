var Node = module.require("../Node").Node;

function VariableDeclarationStatement(declarations) {
    Node.call(this);
    this.type = "VariableDeclarationStatement";

    var self = this;
    declarations.forEach(function(d) {
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
