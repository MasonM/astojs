var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

function ScriptPropertyStatement(label, initialValue) {
    Node.call(this);
    this.type = "Property";
    this.label = label;
    this.label.parent = this;
    this.initialValue = initialValue;
    this.initialValue.parent = this;
}

ScriptPropertyStatement.prototype = Object.create(Node);

ScriptPropertyStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "VariableDeclarator";
    this.id = this.label.codegen();
    this.init = this.initialValue.codegen();
    if (this.parent.type !== "FunctionDeclaration") {
        // top-level script property
        Object.assign(this, this.assignObjectProperty(this.id, this.init));
    }

    return this;
};

exports.ScriptPropertyStatement = ScriptPropertyStatement;
