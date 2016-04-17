var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function RepeatNumTimesStatement(num, body) {
    Node.call(this);
    this.type = "RepeatNumTimesStatement";
    this.num = num;
    this.body = body;
    this.body.parent = this;
}

RepeatNumTimesStatement.prototype = Object.create(Node);

RepeatNumTimesStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;
    this.type = "ForStatement";
    var id = {
        "type": "Identifier",
        "name": "n" // @hack Probably should be smarter about this
    };
    this.init = {
        "type": "VariableDeclaration",
        "declarations": [{
            "type": "VariableDeclarator",
            "id": id,
            "init": { "type": "Literal", "value": 0 }
        }],
        "kind": "let",
        "codeGenerated": true
    };
    this.test = {
        "type": "BinaryExpression",
        "operator": "<",
        "left": id,
        "right": this.num
    };
    this.update = {
        "type": "UpdateExpression",
        "operator": "++",
        "prefix": false,
        "argument": id,
    };
    this.body = this.body.blockWrap().codegen();
    return this;
};

exports.RepeatNumTimesStatement = RepeatNumTimesStatement;
