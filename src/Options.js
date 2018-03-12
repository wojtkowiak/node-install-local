"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Options = /** @class */ (function () {
    function Options(argv) {
        var args = argv // strip the "node install-local" part.
            .filter(function (_, i) { return i > 1; });
        this.dependencies = args
            .filter(function (arg) { return arg.substr(0, 1) !== '-'; });
        this.options = args
            .filter(function (arg) { return arg.substr(0, 1) === '-'; });
    }
    Options.prototype.validate = function () {
        if (this.dependencies.length > 0 && this.targetSiblings) {
            return Promise.reject("Invalid use of option --target-siblings. Cannot be used together with a dependency list");
        }
        else if (this.targetSiblings && this.save) {
            return Promise.reject("Invalid use of option --target-siblings. Cannot be used together with --save");
        }
        else {
            return Promise.resolve();
        }
    };
    Object.defineProperty(Options.prototype, "help", {
        get: function () {
            return this.flag('-h', '--help');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "targetSiblings", {
        get: function () {
            return this.flag('-T', '--target-siblings');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "save", {
        get: function () {
            return this.flag('-S', '--save');
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.flag = function () {
        var _this = this;
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return options.some(function (_) { return _this.options.indexOf(_) >= 0; });
    };
    return Options;
}());
exports.Options = Options;
//# sourceMappingURL=Options.js.map