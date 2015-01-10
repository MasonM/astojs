var nodes = [
    'Program',
    'Property',
    'VariableDeclarator',
    'expressions/ArrayExpression',
    'expressions/BinaryExpression',
    'expressions/LogicalExpression',
    'expressions/ObjectExpression',
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
    'literals/BooleanLiteral',
    'literals/Identifier',
    'literals/NumberLiteral',
    'literals/StringLiteral',
];

nodes.forEach(function(node) {
    var name = node.substring(node.lastIndexOf('/') + 1);
    module.exports[name] = module.require('./ast/' + node)[name];
});
