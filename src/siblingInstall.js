"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fs = require("mz/fs");
var path = require("path");
var helpers_1 = require("./helpers");
var index_1 = require("./index");
function filterTruthy(values) {
    return values.filter(function (v) { return v; });
}
function readSiblingTargets() {
    var currentDirectoryName = path.basename(process.cwd());
    return fs.readdir('..')
        .then(function (dirs) { return dirs.filter(function (dir) { return dir !== currentDirectoryName; }); })
        .then(function (dirs) { return dirs.map(function (dir) { return path.resolve('..', dir); }); })
        .then(function (dirs) { return Promise.all(dirs.map(function (directory) { return helpers_1.readPackageJson(directory)
        .then(function (packageJson) { return ({ directory: directory, packageJson: packageJson }); })
        .catch(function () { return null; }); })); })
        .then(filterTruthy);
}
function siblingTargetsCurrent(siblingPackage) {
    var currentDirectory = path.resolve('.');
    return _.values(siblingPackage.packageJson.localDependencies)
        .some(function (localDependencyPath) { return path.resolve(localDependencyPath) === currentDirectory; });
}
function siblingInstall() {
    return readSiblingTargets()
        .then(function (siblings) { return siblings.filter(siblingTargetsCurrent); })
        .then(function (targets) {
        var sourceByTarget = {};
        targets.forEach(function (target) { return sourceByTarget[target.directory] = ['.']; });
        var installer = new index_1.LocalInstaller(sourceByTarget);
        index_1.progress(installer);
        return installer.install();
    }).then(function () { return void 0; });
}
exports.siblingInstall = siblingInstall;
//# sourceMappingURL=siblingInstall.js.map