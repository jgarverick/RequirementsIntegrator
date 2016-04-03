/// <binding AfterBuild='copy:main,exec:package' />
//---------------------------------------------------------------------
// <copyright file="gruntfile.js">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
// </summary>
//---------------------------------------------------------------------

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        exec: {
            package: {
                command: "tfx extension create --manifest-globs vss-extension.json",
                stdout: true,
                stderr: true
            },
            install: {
                command: "npm install",
                stdout: true,
                stderr: true
            },
            tsdinit: {
                command: "tsd install jquery q knockout",
                stdout: true,
                stderr: true
            },
            tsdlink: {
                command: "tsd link",
                stdout: true,
                stderr: true
            },
            update: {
                command: "npm up --save-dev",
                stdout: true,
                stderr: true
            },
            publish: {
                command: "tfx extension publish",
                stdout: true,
                stderr: true
            }
        },
        copy: {
            main: {
                files: [
                  // includes files within path
                  { expand: true, flatten: true, src: ['node_modules/vss-sdk/lib/VSS.SDK.js'], dest: 'scripts/', filter: 'isFile' }]
            }
        },
        jasmine: {
            src: ["scripts/**/*.js", "sdk/scripts/*.js"],
            specs: "test/**/*[sS]pec.js",
            helpers: "test/helpers/*.js"
        }
    });

    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

};