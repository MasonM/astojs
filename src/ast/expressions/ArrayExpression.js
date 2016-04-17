var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function ArrayExpression(elements) {
    Node.call(this);
    this.type = "ArrayExpression";
    this.elements = elements;

    var self = this;
    _(elements).each(function(element) { if (element) element.parent = self; });
}

ArrayExpression.prototype = Object.create(Node);

ArrayExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i]) this.elements[i] = this.elements[i].codegen();
    }
    return this;
};

exports.ArrayExpression = ArrayExpression;
