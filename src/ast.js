var nodes = [
    'Program',
    'VariableDeclarator',
    'statements/VariableDeclarationStatement',
    'statements/ExpressionStatement',
    'literals/BooleanLiteral',
    'literals/Identifier',
    'literals/NumberLiteral',
];

nodes.forEach(function(node) {
    var name = node.substring(node.lastIndexOf('/') + 1);
    module.exports[name] = module.require('./ast/' + node)[name];
});
