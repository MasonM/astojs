var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function StartsWithExpression(left, right) {
    Node.call(this);
    this.type = 'StartsWithExpression';

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
}

StartsWithExpression.prototype = Object.create(Node);

StartsWithExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.left = this.left.codegen();
    this.right = this.right.codegen();
    this.type = 'CallExpression';
    this.callee = {
        "type": "MemberExpression",
        "computed": false,
        "object": this.left,
        "property": {
            "type": "Identifier",
            "name": "startsWith"
        }
    };
    Object.defineProperty(this, 'arguments', {
        value: [ this.right ]
    });

    return this;
};

exports.StartsWithExpression = StartsWithExpression;
