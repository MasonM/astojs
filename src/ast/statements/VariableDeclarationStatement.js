var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function VariableDeclarationStatement(id, init) {
    Node.call(this);
    this.type = "VariableDeclaration";
    this.kind = "var";
    this.id = id;
    this.id.parent = this;

    this.init = init;
    if (init) this.init.parent = this;
}

VariableDeclarationStatement.prototype = Object.create(Node);

VariableDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.id = this.id.codegen();
    if (this.init) this.init = this.init.codegen();

    this.declarations = [{
        "type": "VariableDeclarator",
        "id": this.id,
        "init": this.init
    }];
    return this;
};

exports.VariableDeclarationStatement = VariableDeclarationStatement;
