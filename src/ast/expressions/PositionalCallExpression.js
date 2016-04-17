var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function PositionalCallExpression(callee, args) {
    Node.call(this);
    this.type = "PositionalCallExpression";
    this.callee = callee;
    this.callee.parent = this;

    Object.defineProperty(this, 'arguments', {
        value: args,
        enumerable: true
    });

    var self = this;
    _(args).each(function(arg) { if (arg) arg.parent = self; });
}

PositionalCallExpression.prototype = Object.create(Node);

PositionalCallExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "CallExpression";
    this.callee = this.callee.codegen();
    for (var i = 0; i < this.arguments.length; i++) {
        if (this.arguments[i]) this.arguments[i] = this.arguments[i].codegen();
    }
    return this;
};

exports.PositionalCallExpression = PositionalCallExpression;
