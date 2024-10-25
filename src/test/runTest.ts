// src/test/runTest.ts
import * as path from 'path';
import { runTests } from '@vscode/test-electron';
import * as os from 'os';

// Test runner
async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index'); // "extensionTestsPath" From VsCode Docs: Testing Extensions/Advanced setup/The test runner script: Your own runner/ https://code.visualstudio.com/api/working-with-extensions/testing-extension The test runner script: When running the extension integration test, --extensionTestsPath points to the test runner script (src/test/suite/index.ts) that programmatically runs the test suite. Below is the test runner script of helloworld-test-sample that uses Mocha to run the test suite. //
        const userDataDir = path.join(os.tmpdir(), 'vscode-test-user-data');

        console.log('Test paths:');
        console.log('Development path:', extensionDevelopmentPath); // 
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

