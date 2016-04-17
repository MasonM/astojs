var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function RepeatListStatement(loopVariable, list, body) {
    Node.call(this);
    this.loopVariable = loopVariable;
    this.loopVariable.parent = this;

    this.list = list;
    this.list.parent = this;

    this.body = body;
    this.body.parent = this;
}

RepeatListStatement.prototype = Object.create(Node);

RepeatListStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "ForInStatement";
    this.left = this.loopVariable;
    this.right = this.list;
    this.body = this.body.blockWrap().codegen();
    return this;
};

exports.RepeatListStatement = RepeatListStatement;
