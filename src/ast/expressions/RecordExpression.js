var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function RecordExpression(properties) {
    Node.call(this);
    this.type = "RecordExpression";
    this.properties = properties;

    var self = this;
    _(properties).each(function(property) { property.parent = self; });
}

RecordExpression.prototype = Object.create(Node);

RecordExpression.prototype.codegen = function () {
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

exports.RecordExpression = RecordExpression;
