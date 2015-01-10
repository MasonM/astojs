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
    this.type = 'NewExpression';
    this.callee = {
        "type": "Identifier",
        "name": "Record"
    }
    for (var i = 0; i < this.properties.length; i++) {
        this.properties[i] = this.properties[i].codegen();
    }
    Object.defineProperty(this, 'arguments', {
        value: [{ "type": "ObjectExpression", "properties": this.properties }],
        enumerable: true
    });
    return this;
};

exports.ObjectExpression = ObjectExpression;
