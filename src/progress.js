"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var path = require("path");
var ProgressKeeper = /** @class */ (function () {
    function ProgressKeeper(stream, pattern, maxTicks) {
        this.stream = stream;
        this.pattern = pattern;
        this.maxTicks = maxTicks;
        this.current = -1;
        this.tick();
    }
    ProgressKeeper.prototype.tick = function (description) {
        this.current++;
        this.line();
        this.stream.write(this.pattern.replace(/:max/g, this.maxTicks.toString()).replace(/:count/g, this.current.toString()));
        if (description) {
            this.stream.write(" (" + description + ")");
        }
    };
    ProgressKeeper.prototype.terminate = function () {
        this.line();
    };
    ProgressKeeper.prototype.line = function () {
        if (this.stream.isTTY) {
            this.stream.clearLine();
            this.stream.cursorTo(0);
        }
        else {
            this.stream.write(os.EOL);
        }
    };
    return ProgressKeeper;
}());
function progress(installer, stream) {
    if (stream === void 0) { stream = process.stdout; }
    var progressKeeper;
    installer.on('packing_start', function (_) { return progressKeeper = new ProgressKeeper(stream, '[install-local] packing - :count/:max', _.length); });
    installer.on('packed', function (pkg) { return progressKeeper.tick(path.basename(pkg)); });
    installer.on('packing_end', function () { return progressKeeper.terminate(); });
    installer.on('install_start', function (toInstall) {
        var installPhrase = Object.keys(toInstall).map(function (_) { return path.basename(_); }).join(', ');
        if (installPhrase.length) {
            stream.write("[install-local] installing into " + installPhrase + os.EOL);
        }
        else {
            stream.write("[install-local] nothing to install" + os.EOL);
        }
    });
    installer.on('installed', function (pkg, stdout, stderr) {
        stream.write("[install-local] " + pkg + " installed" + os.EOL);
        stream.write(stdout);
        stream.write(stderr);
        stream.write(os.EOL);
    });
    installer.on('install_end', function () { return stream.write("[install-local] Done" + os.EOL); });
}
exports.progress = progress;
//# sourceMappingURL=progress.js.map