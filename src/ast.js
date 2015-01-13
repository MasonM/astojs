var nodes = [
    'Parameter',
    'Program',
    'RecordProperty',
    'VariableDeclarator',
    'expressions/ArrayExpression',
    'expressions/BinaryExpression',
    'expressions/EndsWithExpression',
    'expressions/LogicalExpression',
    'expressions/RecordExpression',
    'expressions/StartsWithExpression',
    'expressions/UnaryExpression',
    'statements/BlockStatement',
    'statements/ExpressionStatement',
    'statements/IfStatement',
    'statements/VariableDeclarationStatement',
    'statements/RepeatForeverStatement',
    'statements/RepeatListStatement',
    'statements/RepeatNumTimesStatement',
    'statements/RepeatRangeStatement',
    'statements/RepeatUntilStatement',
    'statements/RepeatWhileStatement',
    'statements/ReturnStatement',
    'statements/SubroutinePositionalDeclarationStatement',
    'literals/BooleanLiteral',
    'literals/Identifier',
    'literals/NumberLiteral',
    'literals/StringLiteral',
];

nodes.forEach(function(node) {
    var name = node.substring(node.lastIndexOf('/') + 1);
    module.exports[name] = module.require('./ast/' + node)[name];
});
