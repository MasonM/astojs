var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function ScriptProperty(label, initialValue) {
    Node.call(this);
    this.type = "Property";
    this.label = label;
    this.label.parent = this;
    this.initialValue = initialValue;
    this.initialValue.parent = this;
}

ScriptProperty.prototype = Object.create(Node);

ScriptProperty.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "VariableDeclarator";
    this.id = this.label.codegen();
    this.init = this.initialValue.codegen();
    return this;
};

exports.ScriptProperty = ScriptProperty;
