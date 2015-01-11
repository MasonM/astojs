var Node = module.require("../Node").Node;

function ReturnStatement(argument) {
    Node.call(this);
    this.type = "ReturnStatement";
    this.argument = argument;
    if (argument) this.argument.parent = this;
}

ReturnStatement.prototype = Object.create(Node);

ReturnStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    if (this.argument) this.argument = this.argument.codegen();
    return this;
};

exports.ReturnStatement = ReturnStatement;
