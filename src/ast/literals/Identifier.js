var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function Identifier(name) {
    Node.call(this);
    this.type = "Identifier";
    this.global = false;
    Object.defineProperty(this, 'name', {
        value: name,
        enumerable: true,
    });
}

Identifier.prototype = Object.create(Node);

Identifier.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    return this;
};

exports.Identifier = Identifier;
