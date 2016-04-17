var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function UnaryExpression(operator, argument) {
    Node.call(this);
    this.type = "UnaryExpression";
    this.operator = operator;
    this.argument = argument;
    this.argument.parent = this;
    this.prefix = true;
}

UnaryExpression.prototype = Object.create(Node);

UnaryExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.argument = this.argument.codegen();
    return this;
};

exports.UnaryExpression = UnaryExpression;
