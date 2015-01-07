var Node = module.require("../Node").Node;

function BinaryExpression(left, operator, right) {
    Node.call(this);
    this.type = 'BinaryExpression';
    this.operator = operator;

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
}

BinaryExpression.prototype = Object.create(Node);

BinaryExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.left = this.left.codegen();
    this.right = this.right.codegen();
    switch (this.operator) {
        case "div": //intentional fall-through
        case "÷":
            this.operator = '/';
            break;
        case "mod":
            this.operator = "%";
            break;
        case "^":
            this.type = 'CallExpression';
            this.callee = {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": "Math"
                },
                "property": {
                    "type": "Identifier",
                    "name": "pow"
                }
            };
            Object.defineProperty(this, 'arguments', {
                value: [this.left, this.right],
                enumerable: true
            });
            break;
    }

    return this;
};

exports.BinaryExpression = BinaryExpression;
