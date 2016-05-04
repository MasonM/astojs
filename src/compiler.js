'use strict';
var escodegen = require('escodegen');

var util = require('util');
module.exports.compile = function (parser, sourceCode, options) {
    var parsedAst = parser.parse(sourceCode);
    if (!parsedAst) return null;

    var parsedComments = parser.parse(sourceCode, { startRule: "StartComments" });
    var javascriptAst = parsedAst.codegen();
    javascriptAst = escodegen.attachComments(javascriptAst, parsedComments, javascriptAst.body); 

    return escodegen.generate(javascriptAst, options);
}
