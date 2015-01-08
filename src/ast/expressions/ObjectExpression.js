var Node = module.require("../Node").Node,
    _ = require('underscore');

function ObjectExpression(properties) {
    Node.call(this);
    this.type = "ObjectExpression";
    this.properties = properties;

    var self = this;
    _(properties).each(function(property) { property.parent = self; });
}

ObjectExpression.prototype = Object.create(Node);

ObjectExpression.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    for (var i = 0; i < this.properties.length; i++) {
        this.properties[i] = this.properties[i].codegen();
    }
    return this;
};

exports.ObjectExpression = ObjectExpression;
