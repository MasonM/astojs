var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function LogicalExpression(left, operator, right) {
    Node.call(this);
    this.type = 'LogicalExpression';
    this.operator = operator;

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
}

LogicalExpression.prototype = Object.create(Node);

LogicalExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.left = this.left.codegen();
    this.right = this.right.codegen();
    return this;
};

exports.LogicalExpression = LogicalExpression;
