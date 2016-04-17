"use strict";
(function () {
    module.exports = function (grunt) {
        require("time-grunt")(grunt);
        require("load-grunt-tasks")(grunt);
        grunt.initConfig({
            nodeunit: { files: ["test/**/*_test.js"] },
            mochacli: {
                options: {
                    reporter: "spec",
                    bail: true,
                    timeout: 15000
                },
                all: ["test/*.js"]
            },
            watch: {
                gruntfile: {
                    files: "<%= jshint.gruntfile.src %>",
                    tasks: ["jshint:gruntfile"]
                },
                lib: {
                    files: "<%= jshint.lib.src %>",
                    tasks: [
                        "jshint:lib",
                        "mochacli"
                    ]
                },
                test: {
                    files: "<%= jshint.test.src %>",
                    tasks: [
                        "jshint:test",
                        "mochacli"
                    ]
                }
            },
            peg: {
                astojs: {
                    src: "src/parser.pegjs",
                    dest: "src/parser.js",
                    options: {
                        trace: true
                    }
                }
            },
        });
        grunt.registerTask("default", [
            "build",
            "mochacli"
        ]);
        grunt.registerTask("build", [
            "peg",
        ]);
    };
}());
