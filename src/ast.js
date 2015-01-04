var nodes = [
    'Program',
    'VariableDeclarator',
    'statements/BlockStatement',
    'statements/ExpressionStatement',
    'statements/IfStatement',
    'statements/VariableDeclarationStatement',
    'literals/BooleanLiteral',
    'literals/Identifier',
    'literals/NumberLiteral',
    'literals/StringLiteral',
];

nodes.forEach(function(node) {
    var name = node.substring(node.lastIndexOf('/') + 1);
    module.exports[name] = module.require('./ast/' + node)[name];
});
