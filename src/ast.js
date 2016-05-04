'use strict';
var appRoot = require('app-root-path'),
    nodes = [
    'Comment',
    'LabelledParameter',
    'Program',
    'RecordProperty',
    'expressions/ArrayExpression',
    'expressions/BinaryExpression',
    'expressions/EndsWithExpression',
    'expressions/LogicalExpression',
    'expressions/PositionalCallExpression',
    'expressions/RecordExpression',
    'expressions/StartsWithExpression',
    'expressions/UnaryExpression',
    'statements/BlockStatement',
    'statements/ExpressionStatement',
    'statements/IfStatement',
    'statements/RepeatForeverStatement',
    'statements/RepeatListStatement',
    'statements/RepeatNumTimesStatement',
    'statements/RepeatRangeStatement',
    'statements/RepeatUntilStatement',
    'statements/RepeatWhileStatement',
    'statements/ReturnStatement',
    'statements/ScriptPropertyStatement',
    'statements/SubroutineLabelledDeclarationStatement',
    'statements/SubroutinePositionalDeclarationStatement',
    'statements/ScriptDeclarationStatement',
    'statements/VariableDeclarationStatement',
    'literals/BooleanLiteral',
    'literals/NullLiteral',
    'literals/Identifier',
    'literals/NumberLiteral',
    'literals/StringLiteral',
];

nodes.forEach(function(node) {
    var name = node.substring(node.lastIndexOf('/') + 1);
    module.exports[name] = require(appRoot + '/src/ast/' + node)[name];
});
