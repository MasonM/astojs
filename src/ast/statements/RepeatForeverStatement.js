var Node = module.require("../Node").Node;

function RepeatForeverStatement(body) {
    Node.call(this);
    this.type = "RepeatForeverStatement";
    this.body = body;
    this.body.parent = this;
}

RepeatForeverStatement.prototype = Object.create(Node);

RepeatForeverStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "WhileStatement";
    this.test = {
        "type": "Literal",
        "value": true,
        "codeGenerated": true
    };
    this.body = this.body.blockWrap().codegen();
    return this;
};

exports.RepeatForeverStatement = RepeatForeverStatement;
