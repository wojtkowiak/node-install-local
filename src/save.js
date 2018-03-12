"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("mz/fs");
var path = require("path");
function saveIfNeeded(options) {
    return function (targets) {
        if (options.save) {
            return Promise.all(targets.map(save)).then(function () { return undefined; });
        }
        else {
            return Promise.resolve();
        }
    };
}
exports.saveIfNeeded = saveIfNeeded;
function save(target) {
    var dependencies = target.packageJson.localDependencies || (target.packageJson.localDependencies = {});
    var dependenciesBefore = Object.assign({}, dependencies);
    target.sources.sort(function (a, b) { return a.directory.localeCompare(b.directory); })
        .forEach(function (source) { return dependencies[source.packageJson.name] = path.relative(target.directory, source.directory).replace(/\\/g, '/'); });
    if (equals(dependencies, dependenciesBefore)) {
        return Promise.resolve();
    }
    else {
        return savePackageJson(target);
    }
}
function savePackageJson(target) {
    return fs.writeFile(path.resolve(target.directory, 'package.json'), JSON.stringify(target.packageJson, undefined, 2), { encoding: 'utf8' });
}
function equals(a, b) {
    var aNames = sortedNames(a);
    var bNames = sortedNames(b);
    if (aNames.length === bNames.length) {
        while (aNames.length) {
            if (!equalDependency(aNames.pop(), bNames.pop(), a, b)) {
                return false;
            }
        }
        return true;
    }
    return false;
}
function equalDependency(aKey, bKey, aDeps, bDeps) {
    return aKey === bKey && aKey && bKey && aDeps[aKey] === bDeps[bKey];
}
function sortedNames(subject) {
    return Object.keys(subject).sort();
}
//# sourceMappingURL=save.js.map