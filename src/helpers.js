"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("mz/fs");
var path = require("path");
function readPackageJson(from) {
    return fs.readFile(path.join(from, 'package.json'), 'utf8').then(function (content) { return JSON.parse(content); });
}
exports.readPackageJson = readPackageJson;
//# sourceMappingURL=helpers.js.map