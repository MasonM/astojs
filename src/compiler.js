'use strict';
var escodegen = require('escodegen');

module.exports.compile = function (parser, sourceCode, options) {
    var applescriptAst = parser.parse(sourceCode);
    if (!applescriptAst) return null;

    var javascriptAst = applescriptAst.codegen();
    var comments = parser.parse(sourceCode, { startRule: "StartComments" });
    javascriptAst = escodegen.attachComments(javascriptAst, comments, javascriptAst.body); 

    return escodegen.generate(javascriptAst, options);
}
