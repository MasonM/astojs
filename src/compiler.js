var parser = module.require('./parser'),
    escodegen = module.require('escodegen');

exports.compile = function (sourceCode, options) {
    var parsed = parser.parse(sourceCode);

    if (!parsed) return null;

    var output = escodegen.generate(parsed.codegen(), options);

    return output;
}
