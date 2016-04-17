var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function NullLiteral(text) {
    Node.call(this);
    this.type = "Literal";

    this.value = null;
    this.raw = text;
}

NullLiteral.prototype = Object.create(Node);

NullLiteral.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    return this;
};

exports.NullLiteral = NullLiteral;
