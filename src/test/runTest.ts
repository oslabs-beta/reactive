// src/test/runTest.ts
import * as path from 'path';
import { runTests } from '@vscode/test-electron';
import * as os from 'os';

// Test runner
async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const userDataDir = path.join(os.tmpdir(), 'vscode-test-user-data');

        console.log('Test paths:');
        console.log('Development path:', extensionDevelopmentPath);
        console.log('Tests path:', extensionTestsPath);
        console.log('User data path:', userDataDir);

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ['--user-data-dir', userDataDir]
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();

