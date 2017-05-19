#!/usr/bin/env node
const path = require('path');
const colors = require('colors');
const crypto = require('crypto');
const fs = require('fs');
const encrypt = require('./lib/encrypt.js');
const decrypt = require('./lib/decrypt.js');
const ls = require('./lib/ls.js');

let argv = require('yargs')
    .usage('Usage: $0 [mode] [options] [file...]')
    .example('$0 --encrypt -f file.txt -k key.txt', 'encrypt the file in place')
    .example('$0 --decrypt -f file.txt -k key.txt', 'decrypt the file in place')
    .alias('encrypt', 'e') // Encrypt mode
    .nargs('e', 0)
    .describe('e', 'Encrypt a file')
    .alias('decrypt', 'd') // Decrypt mode
    .nargs('d', 0)
    .describe('d', 'Decrypt a file')
    // Demand file or directory
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'Choose a file or a directory to encrypt or decrypt')
     // Demand key
    .alias('key', 'K')
    .nargs('K', 1)
    .describe('K', 'Give key phrase on command line')
    // Demand keyfile
    .alias('keyfile', 'k')
    .nargs('k', 1)
    .describe('k', 'Give key phrase on command line')
    // Demand algorithm
    .alias('algorithm', 'a')
    .nargs('a', 1)
    .describe('a', 'Give the algorithm to encrypt and decrypt files')
    // Rename file with original filename and remove the original file
    .alias('rename', 'r')
    .nargs('r', 0)
    .describe('r', 'Rename file with original filename and remove the original file')
    // Help
    .help('h')
    .alias('h', 'help')
    .demandOption(['f'])
    .epilog('Copyright 2017 Cédric JUNG').argv;

const mode = (argv.encrypt && !argv.decrypt ? 'encrypt' : '') || (argv.decrypt && !argv.encrypt ? 'decrypt' : '');
const p = path.resolve(process.cwd(), argv.file);
const algorithm = (argv.algorithm ? argv.algorithm : 'aes192');


const stat = fs.statSync(p);
if(!require('exists-file').sync(p) && !stat.isDirectory()) {
  console.error('The file does not exist.'.red);
  process.exit(1);
}

let list = [p];
if (stat.isDirectory()) {
  list = ls(p);
}

let passphrase = argv.key;

if (!passphrase && argv.keyfile) {
  try {
    passphrase = fs.readFileSync(path.resolve(process.cwd(), argv.keyfile),'utf8');
  } catch (e) {
    console.error('The file you provided does not exist.'.red);
    process.exit(1);
  }
}
if (!passphrase && !argv.keyfile) {
  console.error('You did not provided a key.'.red);
  process.exit(1);
}

const logErr = function (err) {
  console.log('An error occured.'.red);
  console.error(err);
};

if (mode == 'encrypt') {
  list.forEach(function (filePath) {
    encrypt(filePath, algorithm, passphrase, function (err) {
      if (err) return logErr(err);
      if (argv.rename) {
        fs.rename(filePath+'.enc', filePath, function () {
          if (err) return logErr(err);
          console.log(colors.yellow(filePath) + ' File has been encrypted.'.green);
        });
      } else {
        console.log(colors.yellow(filePath) + ' File has been encrypted.'.green);
      }
    });
  });
} else if (mode == 'decrypt') {
  list.forEach(function (filePath) {
    decrypt(filePath, algorithm, passphrase, function (err) {
      if (err) return logErr(err);
      console.log(colors.yellow(filePath) + ' File has been decrypted.'.green);
    });
  });
} else {
  console.log('You didn\'t selected any mode. Please add `--encrypt` or `--decrypt`'.red);
}
