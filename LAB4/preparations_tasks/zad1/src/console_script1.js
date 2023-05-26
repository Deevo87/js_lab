/* ********* */
/* CommonsJS */
/* ********* */
// const fs = require('fs-extra')
// const { argv } = require('node:process');

/* **** */
/* ES6  */
/* **** */
 //żeby naprawić plik musiałem dodać w pliku package.json type:module
import fs from 'fs-extra';
import { argv } from 'node:process';

/************************* */
function read_sync() {
    console.log(`\x1B[32mWykonano pierwszą linię funkcji "read_sync()"\x1B[0m`);
    let data = fs.readFileSync(argv[1]);
    console.log('\x1B[33mZakończono wczytywanie zawartości pliku — zawartość jest dostępna w zmiennej \'data\'\x1B[0m');
    console.log(`\x1B[32mWykonano ostatnią linię funkcji "read_sync()"\x1B[0m`);
}

function read_async() {
    console.log(`\x1B[32mWykonano pierwszą linię funkcji "read_async()"\x1B[0m`);
    fs.readFile(argv[1], (err, data) => {
        if (err) throw err;
        console.log('\x1B[33mZakończono wczytywanie zawartości pliku — zawartość jest dostępna w zmiennej \'data\'\x1B[0m');
    });
    console.log(`\x1B[32mWykonano ostatnią linię funkcji "read_async()"\x1B[0m`);
}
/************************* */

console.clear()
console.log(`\x1B[31mSynchroniczny odczyt pliku "${argv[1]}"\x1B[0m`);
read_sync();
console.log('------------------');
console.log(`\x1B[31mAsynchroniczny odczyt pliku "${argv[1]}"\x1B[0m`);
read_async();
console.log('\x1B[34mWykonano ostatnią linię skryptu\x1B[0m'); 