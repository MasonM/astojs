'use strict';

let escodegen = require('escodegen'),
    pegUtil = require('pegjs-util')

module.exports.compile = function (parser, sourceCode, options) {
    let applescriptParseResult = pegUtil.parse(parser, sourceCode);
    if (applescriptParseResult.error) {
        console.log(pegUtil.errorMessage(applescriptParseResult.error))
        return null;
    }

    let comments = parser.parse(sourceCode, { startRule: "StartComments" });
    let javascriptAst = applescriptParseResult.ast.transformToESTree();
    javascriptAst = escodegen.attachComments(javascriptAst, comments, javascriptAst.body); 

    return escodegen.generate(javascriptAst, options);
}
