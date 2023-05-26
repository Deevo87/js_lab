let cnt = 12;

//zmień type:modules
// const prompt = require('prompt-sync')({sigint: true});
// const readline = require('readline');
// const { exec } = require('child_process');
// const fs = require('fs-extra')
// const { argv } = require('node:process');

import promptSync from 'prompt-sync';
import readline from 'readline';
import { exec } from 'child_process';
import fs from 'fs-extra';
import { argv } from 'node:process';

const read_sync = () => {
    let data = fs.readFileSync(argv[1]);
    // console.log(`${data.slice(9, 10)}`);
    cnt += 1;
    if (cnt < 10) {
        // console.log(`\x1B[32mData: "${data.slice(0, 10) + `${cnt}` + data.slice(12)}"\x1B[0m`);
        data = data.slice(0, 10) + `${cnt}` + data.slice(11);
    } else {
        data = data.slice(0, 10) + `${cnt};` + data.slice(13);
    }
    fs.writeFileSync(argv[1], data);
    console.log(`Liczba wywołań: ${cnt}`);
}


const read_async = () => {
    let data = fs.readFile(argv[1], (err, data) => {
        if (err) throw err;
        // console.log(`${data.slice(9, 10)}`);
        cnt += 1;
        if (cnt < 10) {
            data = data.slice(0, 10) + cnt.toString() + data.slice(11);
            // console.log(`\x1B[32mData: "${updatedData.slice(0, 10) + cnt.toString() + updatedData.slice(12)}"\x1B[0m`);
            fs.writeFile(argv[1], data, (err) => {
                if (err) throw err;
            });
        } else {
            // console.log(`\x1B[32mData: "${updatedData.slice(0, 10) + cnt.toString() + updatedData.slice(12)}"\x1B[0m`);
            let updata = data.slice(0, 10) + cnt.toString() + ";" + data.slice(13);
            fs.writeFile(argv[1], updata, (err) => {
                if (err) throw err;
            });
        }
        console.log(`Liczba wywołań: ${cnt}`);
    });
}



let flag = argv[2];
console.log(`\x1B[32mArgumenty wywołania: "${argv[2]}"\x1B[0m`);

if (flag === "--async") {
    read_async();
} else if (flag =='--sync') {
    read_sync();
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
      rl.prompt();
      
      rl.on('line', (input) => {
        exec(input.trim(), (error, stdout, stderr) => {
          if (error) {
            console.error(`Błąd: ${error}`);
            return;
          }
          console.log(`Wynik: ${stdout}`);
        });
        rl.prompt();
      });
      rl.on('close', () => {
        process.exit();
      })

}

