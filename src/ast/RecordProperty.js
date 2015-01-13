var Node = module.require("./Node").Node;

function RecordProperty(key, value, shorthand, method) {
    Node.call(this);
    this.type = "Property";
    this.kind = 'init';
    this.method = method;
    this.shorthand = shorthand;
    this.computed = false;

    this.key = key;
    this.key.parent = this;

    this.value = value;
    this.value.parent = this;
}

RecordProperty.prototype = Object.create(Node);

RecordProperty.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.key = this.key.codegen(false);
    this.value = this.value.codegen(this.parent.type != "ObjectPattern");
    return this;
};

exports.RecordProperty = RecordProperty;
