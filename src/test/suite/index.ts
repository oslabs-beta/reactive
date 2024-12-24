// src/test/suite/index.ts
import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export async function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd',
        color: true,
        timeout: 60000
    });

    const testsRoot = path.resolve(__dirname);
    
    try {
        console.log('Looking for test files in:', testsRoot);
        // Change the glob pattern to explicitly look for extension.test.ts/js
        const testFiles = await glob([
            '**/extension.test.js', 
            '**/dendrogram.test.js',
            '**/parserPerformance.test.js'
        ], { 
            cwd: testsRoot,
            absolute: true  // Get absolute paths
        });
        
        console.log('Found test files:', testFiles);

        if (testFiles.length === 0) {
            console.warn('No test files found! Checking directory contents...');
            const allFiles = await glob('**/*', { 
                cwd: testsRoot,
                absolute: true
            });
            console.log('All files in directory:', allFiles);
        }

        // Add files to mocha
        testFiles.forEach(file => {
            console.log('Adding test file:', file);
            mocha.addFile(file);
        });

        // Run the mocha test
        return new Promise<void>((resolve, reject) => {
            try {
                const runner = mocha.run(failures => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    } else {
                        resolve();
                    }
                });

                runner.on('test', (test) => {
                    console.log('Running test:', test.title);
                });
            } catch (err) {
                console.error('Error running mocha:', err);
                reject(err);
            }
        });
    } catch (err) {
        console.error('Error during test setup:', err);
        throw err;
    }
}

