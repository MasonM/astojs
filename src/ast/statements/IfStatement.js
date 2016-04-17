var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function IfStatement(test, consequent, alternate) {
    Node.call(this);
    this.type = "IfStatement";
    this.test = test;
    this.test.parent = this;

    this.consequent = consequent;
    this.consequent.parent = this;

    this.alternate = alternate;
    if (this.alternate) this.alternate.parent = this;
}

IfStatement.prototype = Object.create(Node);

IfStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.test = this.test.codegen();
    this.consequent = this.consequent.blockWrap().codegen();
    if (this.alternate) this.alternate = this.alternate.blockWrap().codegen();
    return this;
};

exports.IfStatement = IfStatement;
