var path = require("path");
var webpack = require("webpack");

module.exports = {
    target: "web",
    entry: {
        app: "./src/mappings.ts",
        importDialog: "./src/importDialog.ts",
        mappingDialog: "./src/mappingDialog.ts",
        common: "./src/common.ts",
        adapters: "./src/adapters.ts",
        gaps: "./src/gaps.ts",
        services: "./src/services.ts",
        sprints: "./src/sprints.ts",
        storage: "./src/storage.ts",
        utilities: "./src/utilities.ts",
        visualizer: "./src/visualizerDialog.ts"
    },
    output: {
        filename: "[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: ["*",".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [path.resolve("./src"),"node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: "tslint-loader",
                options: {
                    emitErrors: true,
                    failOnHint: true
                }
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
}