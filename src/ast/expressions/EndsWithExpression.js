var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

function EndsWithExpression(left, right) {
    Node.call(this);
    this.type = 'EndsWithExpression';

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
}

EndsWithExpression.prototype = Object.create(Node);

EndsWithExpression.prototype.codegen = function () {
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
            "name": "endsWith"
        }
    };
    Object.defineProperty(this, 'arguments', {
        value: [ this.right ]
    });

    return this;
};

exports.EndsWithExpression = EndsWithExpression;
