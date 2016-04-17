var appRoot = module.require('app-root-path'),
    Node = module.require(appRoot + "/src/ast/Node").Node;

function Program(body) {
    Node.call(this);

    this.type = "Program";
    this.body = (body === null) ? null : body.map(function(statement) {
        if (statement) {
            statement.parent = this;
            return statement;
        } else {
            return { type: 'EmptyStatement' };
        }
    });
}

Program.prototype = Object.create(Node);

Program.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) return;

    for (var i = 0; i < this.body.length;) {
        var statement = this.body[i];

        if (!statement || statement.codeGenerated) {
            i++;
        } else if (statement.codegen && statement.codegen()) {
            this.body[this.body.indexOf(statement)] = statement;
            i++;
        } else {
            this.body.splice(i, 1);
        }
    }

    return this;
};

exports.Program = Program;
