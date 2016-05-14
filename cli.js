#! /usr/bin/env node

"use strict";

let nomnom = require("nomnom"),
    cli_file_processor = require("./src/CliFileProcessor"),
    json = require("./package.json");

let opts = nomnom
.option("files", {
    position: 0,
    help: "Files to compile. The compiled versions will be saved with the same filename, except with a .js extension.",
    list: true
})
.option("stdout", {
    abbr: "s",
    flag: true,
    help: "instead of saving compiled source, output to stdout "
})
.option("debug", {
    abbr: "d",
    flag: true,
    help: "debug mode"
})
.option("version", {
    flag: true,
    help: "display the version number",
    callback: function () {
        return "version " + json.version;
    }
})
.parse();

if (!opts.files) {
    console.log(nomnom.getUsage());
    process.exit(0);
}

let processor = new cli_file_processor.CliFileProcessor(opts.debug, opts.stdout);
opts.files.forEach(fileName => processor.processFile(fileName));
