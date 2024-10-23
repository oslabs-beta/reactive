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
        const testFiles = await glob(['**/extension.test.js', '**/extension.test.ts'], { 
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

// // src/test/suite/index.ts
// import * as path from 'path';
// import Mocha from 'mocha';
// import { glob } from 'glob';

// export async function run(): Promise<void> {
//     const mocha = new Mocha({
//         ui: 'tdd',
//         color: true,
//         timeout: 60000
//     });

//     const testsRoot = path.resolve(__dirname, '.');
    
//     try {
//         console.log('Looking for test files in:', testsRoot);
//         const testFiles = await glob('**/*.test.ts', { 
//             cwd: testsRoot
//         });
        
//         console.log('Found test files:', testFiles);

//         testFiles.forEach(file => {
//             console.log('Adding test file:', file);
//             mocha.addFile(path.resolve(testsRoot, file));
//         });

//         // Run the mocha test
//         return new Promise<void>((resolve, reject) => {
//             mocha.run(failures => {
//                 if (failures > 0) {
//                     reject(new Error(`${failures} tests failed.`));
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//     } catch (err) {
//         console.error('Error running tests:', err);
//         throw err;
//     }
// }

// // src/test/suite/index.ts
// import path from 'path';
// import Mocha from 'mocha';
// import { glob } from 'glob';
// import * as fs from 'fs';

// export async function run(): Promise<void> {
//     // Create the mocha test
//     const mocha = new Mocha({
//         ui: 'tdd',
//         color: true,
//         timeout: 60000
//     });

//     const testsRoot = path.resolve(__dirname, '.');

//     try {
//         // Find all test files
//         const testFiles = await glob('*.test.ts', { 
//             cwd: testsRoot,
//             absolute: true
//         });

//         // Add files to mocha
//         testFiles.forEach(file => {
//             mocha.addFile(file);
//         });

//         // Run the mocha test
//         return new Promise<void>((resolve, reject) => {
//             try {
//                 mocha.run(failures => {
//                     if (failures > 0) {
//                         reject(new Error(`${failures} tests failed.`));
//                     } else {
//                         resolve();
//                     }
//                 });
//             } catch (err) {
//                 reject(err);
//             }
//         });
//     } catch (err) {
//         console.error('Failed to run tests:', err);
//         throw err;
//     }
// }

// import path from 'path';
// import Mocha from 'mocha';
// import { glob as globPromise } from 'glob';

// export async function run(): Promise<void> {
//     // Create the mocha test
//     const mocha = new Mocha({
//         ui: 'tdd',
//         color: true
//     });

//     const testsRoot = path.resolve(__dirname, '..');
    
//     try {
//         // Use the promisified version of glob
//         const files: string[] = await globPromise('**/**.test.ts', { 
//             cwd: testsRoot 
//         });

//         // Add files to mocha
//         files.forEach((file: string) => {
//             mocha.addFile(path.resolve(testsRoot, file));
//         });

//         // Run the mocha test
//         await new Promise<void>((resolve, reject) => {
//             mocha.run((failures: number) => {
//                 if (failures > 0) {
//                     reject(new Error(`${failures} tests failed.`));
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('Error running tests:', error);
//         throw error;
//     }
// }

// // REACTIVE/src/test/suite/index.ts

// import * as path from 'path';
// import * as Mocha from 'mocha';
// import * as glob from 'glob';

// export function run(): Promise<void> {
//   // Create the mocha test
//   const mocha = new Mocha({
//     ui: 'tdd',
//     color: true
//   });

//   const testsRoot = path.resolve(__dirname, '..');

//   return new Promise((c, e) => {
//     glob('**/**.test.ts', { cwd: testsRoot }, (err, files) => {
//       if (err) {
//         return e(err);
//       }

//       // Add files to the test suite
//       files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

//       try {
//         // Run the mocha test
//         mocha.run(failures => {
//           if (failures > 0) {
//             e(new Error(`${failures} tests failed.`));
//           } else {
//             c();
//           }
//         });
//       } catch (err) {
//         console.error(err);
//         e(err);
//       }
//     });
//   });
// }