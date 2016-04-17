var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function RepeatWhileStatement(test, body) {
    Node.call(this);
    this.type = "RepeatWhileStatement";
    this.test = test;
    this.test.parent = this;

    this.body = body;
    this.body.parent = this;
}

RepeatWhileStatement.prototype = Object.create(Node);

RepeatWhileStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "WhileStatement";
    this.body = this.body.blockWrap().codegen();
    return this;
};

exports.RepeatWhileStatement = RepeatWhileStatement;
