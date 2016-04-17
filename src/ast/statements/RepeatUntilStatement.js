var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node;

function RepeatUntilStatement(test, body) {
    Node.call(this);
    this.type = "RepeatUntilStatement";
    this.test = test;
    this.test.parent = this;

    this.body = body;
    this.body.parent = this;
}

RepeatUntilStatement.prototype = Object.create(Node);

RepeatUntilStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "WhileStatement";
    this.test = {
        type: "UnaryExpression",
        operator: "!",
        prefix: true,
        argument: this.test
    };
    this.body = this.body.blockWrap().codegen();
    return this;
};

exports.RepeatUntilStatement = RepeatUntilStatement;
