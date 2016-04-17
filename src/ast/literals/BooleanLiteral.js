var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function BooleanLiteral(text) {
    Node.call(this);
    this.type = "Literal";

    this.value = text == "true";
    this.raw = text;
}

BooleanLiteral.prototype = Object.create(Node);

BooleanLiteral.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    return this;
};

exports.BooleanLiteral = BooleanLiteral;
