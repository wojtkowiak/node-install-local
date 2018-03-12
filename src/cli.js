"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
function cli(argv) {
    var l = console.log;
    var options = new index_1.Options(argv);
    if (options.help) {
        l();
        l('Install packages locally.');
        l();
        l('Usage:');
        l(' install-local');
        l(' install-local [options] <directory>[, <directory>, ...]');
        l(' install-local --target-siblings');
        l();
        l('Installs packages from the filesystem into the current directory.');
        l('Or installs the package located in the current directory to sibling packages that depend on this package with --target-siblings.');
        l();
        l('Options: ');
        l();
        l(' -h, --help              Output this help');
        l(' -S, --save              Saved packages will appear in your package.json under "localDependencies"');
        l(' -T, --target-siblings   Instead of installing into this package, this package gets installed into sibling packages');
        l('                         which depend on this package by putting it in the "localDependencies".');
        l('                         Useful in a [lerna](https://github.com/lerna/lerna) style monorepo.');
        l();
        l('Examples: ');
        l(' install-local');
        l('   install the "localDependencies" of your current package');
        l(' install-local ..');
        l('   install the package located in the parent folder into the current directory.');
        l(' install-local --save ../sibling ../sibling2');
        l('   install the packages of 2 sibling directories into the current directory and save them to "localDependencies" in your package.json file.');
        return Promise.resolve();
    }
    else {
        return options.validate()
            .then(function () { return index_1.execute(options); });
    }
}
exports.cli = cli;
//# sourceMappingURL=cli.js.map