var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function ScriptDeclarationStatement(id, properties, handlers, implicitrun) {
    Node.call(this);
    this.type = "ScriptDeclaration";

    this.id = id;
    this.id.parent = this;

    this.implicitrun = implicitrun;
    this.implicitrun.parent = this;

    this.properties = properties;
    this.handlers = handlers;

    var self = this;
    _(properties).each(function(p) { p.parent = self; });
    _(handlers).each(function(h) { h.parent = self; });
}

ScriptDeclarationStatement.prototype = Object.create(Node);

ScriptDeclarationStatement.prototype.assignObjectProperty = function(name, value) {
    return {
        "type": "ExpressionStatement",
        "expression": {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "ThisExpression"
                },
                "property": name
            },
            "right": value
        }
    }
}

ScriptDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    this.type = 'FunctionDeclaration';
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.expression = false;
    this.params = [];

    this.id = this.id.codegen();
    this.implicitrun = this.implicitrun.codegen();
    for (var i = 0; i < this.properties.length; i++) {
        this.properties[i] = this.properties[i].codegen();
    }
    for (var i = 0; i < this.handlers.length; i++) {
        this.handlers[i] = this.handlers[i].codegen();
    }

    this.body = {
        "type": "BlockStatement",
        "body": [],
    };
    for (var i = 0; i < this.properties.length; i++) {
        this.body.body.push(this.assignObjectProperty(this.properties[i].id, this.properties[i].init));
    }
    for (var i = 0; i < this.handlers.length; i++) {
        this.handlers[i].type = "FunctionExpression";
        this.body.body.push(this.assignObjectProperty(this.handlers[i].id, this.handlers[i]));
    }
    if (this.implicitrun && this.implicitrun.body.length > 0) {
        // make the implicit run handler explicit
        this.implicitrun = {
            "type": "FunctionExpression",
            "id": {
                "type": "Identifier",
                "name": "run"
            },
            "body": this.implicitrun,
            "params": [],
            "defaults": [],
            "rest": null,
            "generator": false,
            "expression": false
        };
        this.body.body.push(this.assignObjectProperty(this.implicitrun.id, this.implicitrun));
    }
    return this;
};

exports.ScriptDeclarationStatement = ScriptDeclarationStatement;
