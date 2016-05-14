"use strict";

let fs = require("fs"),
    pegjs = require("pegjs"),
    beautify = require("js-beautify"),
    json = require("../package.json"),
    compiler = require("./compiler");


class CliFileProcessor {
    constructor(debugMode, stdout) {
        this.debugMode = debugMode;
        this.stdout = stdout;
    }

    processFile(fileName) {
        fs.readFile(fileName, "utf-8", (error, contents) => {
            if (error) { return console.log(error); }
            this.processFileContents(contents);
        });
    }

    processFileContents(contents) {
        let js_source = this.compile(contents);
        if (!js_source) { return; }

        js_source = "// Generated by ASToJS v" + json.version + "\n" +
            "(function() {\n" + js_source + "\n}());";

        js_source = beautify.js_beautify(js_source, { indent_size: 4 });

        if (this.stdout) {
            console.log(js_source);
        } else {
            let outFileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
            this.writeFile(outFileNameWithoutExtension + ".js", js_source);
        }
    }

    compile(contents) {
        return compiler.compile(this.getParser(), contents, { comment: true });
    }

    getParser() {
        if (this.debugMode) {
            let grammar = fs.readFileSync('./parser.pegjs', 'utf8');
            let options = { trace: true, allowedStartRules: ['Start', 'StartComments'] };
            return pegjs.buildParser(grammar, options);
        } else {
            return module.require('./parser');
        }
    }

    writeFile(fileName, content) {
        fs.writeFile(fileName, content, error => {
            if (error) { return console.log(error); }
        });
    }
}

module.exports.CliFileProcessor = CliFileProcessor;
