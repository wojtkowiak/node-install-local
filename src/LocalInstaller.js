"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var _ = require("lodash");
var child_process_1 = require("mz/child_process");
var fs = require("mz/fs");
var os = require("os");
var path = require("path");
var helpers_1 = require("./helpers");
var LocalInstaller = /** @class */ (function (_super) {
    __extends(LocalInstaller, _super);
    function LocalInstaller(sourcesByTarget, options) {
        var _this = _super.call(this) || this;
        _this.sourcesByTarget = resolve(sourcesByTarget);
        if (options) {
            _this.options = Object.assign({}, options);
        }
        else {
            _this.options = {};
        }
        return _this;
    }
    LocalInstaller.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    LocalInstaller.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    LocalInstaller.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            var packages, installTargets, packedSources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolvePackages()];
                    case 1:
                        packages = _a.sent();
                        installTargets = this.identifyInstallTargets(packages);
                        return [4 /*yield*/, this.packAll()];
                    case 2:
                        packedSources = _a.sent();
                        return [4 /*yield*/, this.installAll(installTargets)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.removeAllPackedTarballs(packedSources, packages)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, installTargets];
                }
            });
        });
    };
    LocalInstaller.prototype.installAll = function (installTargets) {
        var _this = this;
        this.emit('install_start', this.sourcesByTarget);
        return Promise.all(installTargets.map(function (target) { return _this.installOne(target); }))
            .then(function () { return void _this.emit('install_end'); });
    };
    LocalInstaller.prototype.installOne = function (target) {
        var _this = this;
        var toInstall = target.sources.map(function (source) { return resolvePackFile(source.packageJson); }).join(' ');
        var options = { cwd: target.directory };
        if (this.options.npmEnv) {
            options.env = this.options.npmEnv;
        }
        return child_process_1.exec("npm i --no-save " + toInstall, options).then(function (_a) {
            var stdout = _a[0], stderr = _a[1];
            return void _this.emit('installed', target.packageJson.name, stdout.toString(), stderr.toString());
        });
    };
    LocalInstaller.prototype.resolvePackages = function () {
        var _this = this;
        var uniqueDirectories = _.uniq(Object.keys(this.sourcesByTarget)
            .concat(_.flatMap(Object.keys(this.sourcesByTarget), function (target) { return _this.sourcesByTarget[target]; })));
        var allPackages = Promise.all(uniqueDirectories.map(function (directory) { return helpers_1.readPackageJson(directory).then(function (packageJson) { return ({ directory: directory, packageJson: packageJson }); }); }));
        return allPackages.then(function (packages) {
            var packageByDirectory = {};
            packages.forEach(function (pkg) { return packageByDirectory[pkg.directory] = pkg.packageJson; });
            return packageByDirectory;
        });
    };
    LocalInstaller.prototype.identifyInstallTargets = function (packages) {
        var _this = this;
        var installTargets = Object.keys(this.sourcesByTarget).map(function (target) { return ({
            directory: target,
            packageJson: packages[target],
            sources: _this.sourcesByTarget[target].map(function (source) { return ({
                directory: source,
                packageJson: packages[source]
            }); })
        }); });
        this.emit('install_targets_identified', installTargets);
        return installTargets;
    };
    LocalInstaller.prototype.packAll = function () {
        var _this = this;
        var allSources = _.uniq(_.flatMap(Object.keys(this.sourcesByTarget), function (target) { return _this.sourcesByTarget[target]; }));
        this.emit('packing_start', allSources);
        return Promise.all(allSources.map(function (source) { return _this.packOne(source); }))
            .then(function () { return _this.emit('packing_end'); })
            .then(function () { return allSources; });
    };
    LocalInstaller.prototype.packOne = function (directory) {
        var _this = this;
        return child_process_1.exec("npm pack " + directory, { cwd: os.tmpdir() })
            .then(function () { return void _this.emit('packed', directory); });
    };
    LocalInstaller.prototype.removeAllPackedTarballs = function (allSources, packages) {
        var allSourcePackages = allSources
            .map(function (source) { return path.resolve(resolvePackFile(packages[source])); });
        return Promise.all(allSourcePackages.map(del));
    };
    return LocalInstaller;
}(events_1.EventEmitter));
exports.LocalInstaller = LocalInstaller;
function resolvePackFile(pkg) {
    // Don't forget about scoped packages
    var scopeIndex = pkg.name.indexOf('@');
    var slashIndex = pkg.name.indexOf('/');
    if (scopeIndex === 0 && slashIndex > 0) {
        // @s/b -> s-b-x.x.x.tgz
        return path.resolve(os.tmpdir(), pkg.name.substr(1, slashIndex - 1) + "-" + pkg.name.substr(slashIndex + 1) + "-" + pkg.version + ".tgz");
    }
    else {
        // b -> b-x.x.x.tgz
        return path.resolve(os.tmpdir(), pkg.name + "-" + pkg.version + ".tgz");
    }
}
function resolve(packagesByTarget) {
    var resolvedPackages = {};
    Object.keys(packagesByTarget).forEach(function (localTarget) {
        resolvedPackages[path.resolve(localTarget)] = _.uniq(packagesByTarget[localTarget].map(function (pkg) { return path.resolve(pkg); }));
    });
    return resolvedPackages;
}
exports.resolve = resolve;
function del(file) {
    return fs.unlink(file);
}
//# sourceMappingURL=LocalInstaller.js.map