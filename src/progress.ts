import * as os from 'os';
import * as path from 'path';
import { LocalInstaller } from './LocalInstaller';

class ProgressKeeper {
    private current = -1;
    constructor(private stream: NodeJS.Socket, private pattern: string, private maxTicks: number) {
        this.tick();
    }

    public tick(description?: string) {
        this.current++;
        this.line();
        this.stream.write(this.pattern.replace(/:max/g, this.maxTicks.toString()).replace(/:count/g, this.current.toString()));
        if (description) {
            this.stream.write(` (${description})`);
        }
    }

    public terminate() {
        this.line();
    }

    private line() {
        if (this.stream.isTTY) {
            (this.stream as any).clearLine();
            (this.stream as any).cursorTo(0);
        } else {
            this.stream.write(os.EOL);
        }
    }
}

export function progress(installer: LocalInstaller, stream = process.stdout) {

    let progressKeeper: ProgressKeeper;
    installer.on('packing_start', _ => progressKeeper = new ProgressKeeper(stream, '[install-local] packing - :count/:max', _.length));
    installer.on('packed', pkg => progressKeeper.tick(path.basename(pkg)));
    installer.on('packing_end', () => progressKeeper.terminate());
    installer.on('install_start', toInstall =>
        stream.write(`[install-local] installing into ${Object.keys(toInstall).join(', ')}${os.EOL}`));
    installer.on('installed', (pkg, stdout, stderr) => {
        stream.write(`[install-local] ${pkg} installed${os.EOL}`);
        stream.write(stdout);
        stream.write(stderr);
        stream.write(os.EOL);
    });
    installer.on('install_end', () => stream.write(`[install-local] Done${os.EOL}`));
}