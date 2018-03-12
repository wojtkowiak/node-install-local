"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var helpers_1 = require("./helpers");
var index_1 = require("./index");
function currentDirectoryInstall(options) {
    return readLocalDependencies(options.dependencies)
        .then(function (localDependencies) {
        var installer = new index_1.LocalInstaller({ '.': localDependencies });
        index_1.progress(installer);
        return installer.install()
            .then(index_1.saveIfNeeded(options));
    });
}
exports.currentDirectoryInstall = currentDirectoryInstall;
function readLocalDependencies(dependenciesFromArguments) {
    if (dependenciesFromArguments.length) {
        return Promise.resolve(dependenciesFromArguments);
    }
    else {
        return helpers_1.readPackageJson('.').then(function (pkg) {
            if (pkg.localDependencies) {
                return _.values(pkg.localDependencies);
            }
            else {
                return [];
            }
        });
    }
}
//# sourceMappingURL=currentDirectoryInstall.js.map