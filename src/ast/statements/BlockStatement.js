var appRoot = require('app-root-path'),
    Node = require(appRoot + "/src/ast/Node").Node,
    _ = require('underscore');

function BlockStatement(body) {
    Node.call(this);
    this.type = 'BlockStatement';
    this.body = body;

    var self = this;
    _(body).each(function(statement) {
        if (statement) {
            statement.parent = self;
        } else {
            body[i] = { type: 'EmptyStatement' };
        }
    });
}

BlockStatement.prototype = Object.create(Node);

BlockStatement.prototype.codegen = function () {
    if (!Node.prototype.codegen.call(this)) return;

    for (var i = 0; i < this.body.length;) {
        var statement = this.body[i];

        if (!statement || statement.codeGenerated) {
            i++;
            continue;
        } else if (statement && statement.codegen()) {
            this.body[this.body.indexOf(statement)] = statement;
            i++;
        } else {
            this.body.splice(i, 1);
        }
    }
    return this;
};

exports.BlockStatement = BlockStatement;
