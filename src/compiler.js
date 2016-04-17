var escodegen = require('escodegen');

exports.compile = function (parser, sourceCode, options) {
    var parsed = parser.parse(sourceCode);

    if (!parsed) return null;

    var output = escodegen.generate(parsed.codegen(), options);

    return output;
}
