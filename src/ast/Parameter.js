var Node = module.require("./Node").Node;

function Parameter(label, id) {
    Node.call(this);
    this.type = "Parameter";
    this.label = label;
    if (this.label) this.label.parent = this;

    this.id = id;
    this.id.parent = this;
}

Parameter.prototype = Object.create(Node);

Parameter.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = 'Identifier';
    this.id = this.id.codegen();
    return this.id;
};

exports.Parameter = Parameter;
