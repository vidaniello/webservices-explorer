/**
 * Script for remove builds tsc folders
 */
const fs = require('fs');
fs.rmSync('./tests',{recursive: true, force: true});
console.log(`'./tests' removed`);
fs.rmSync('./dist',{recursive: true, force: true});
console.log(`'./dist' removed`);