var Node = module.require("./Node").Node;

function LabelledParameter(label, id) {
    Node.call(this);
    this.type = "LabelledParameter";
    this.label = label;
    this.id = id;
    this.id.parent = this;
}

LabelledParameter.prototype = Object.create(Node);

LabelledParameter.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "Identifier";
    this.id = this.id.codegen();
    return this;
};

exports.LabelledParameter = LabelledParameter;
