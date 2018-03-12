"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
function execute(options) {
    if (options.targetSiblings) {
        return index_1.siblingInstall();
    }
    else {
        return index_1.currentDirectoryInstall(options);
    }
}
exports.execute = execute;
//# sourceMappingURL=executor.js.map