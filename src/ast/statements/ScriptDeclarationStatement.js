var Node = module.require("../Node").Node,
    _ = require('underscore');

function ScriptDeclarationStatement(id, properties, handlers, statements) {
    Node.call(this);
    this.type = "ScriptDeclaration";

    this.id = id;
    this.id.parent = this;

    this.properties = properties;
    this.handlers = handlers;
    this.statements = statements;

    var self = this;
    _(properties).each(function(p) { p.parent = self; });
    _(handlers).each(function(h) { h.parent = self; });
    _(statements).each(function(s) { s.parent = self; });
}

ScriptDeclarationStatement.prototype = Object.create(Node);

ScriptDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    this.type = 'FunctionDeclaration';
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.expression = false;
    this.params = [];

    this.id = this.id.codegen();
    for (var i = 0; i < this.properties.length; i++) {
        this.properties[i] = this.properties[i].codegen();
    }
    for (var i = 0; i < this.handlers.length; i++) {
        this.handlers[i] = this.handlers[i].codegen();
    }
    for (var i = 0; i < this.statements.length; i++) {
        this.statements[i] = this.statements[i].codegen();
    }

    this.body = {
        "type": "BlockStatement",
        "body": [],
    };
    for (var i = 0; i < this.properties.length; i++) {
        this.body.body.push({
            "type": "VariableDeclaration",
            "kind": "let",
            "declarations": [this.properties[i]]
        });
    }
    return this;
};

exports.ScriptDeclarationStatement = ScriptDeclarationStatement;
