#!/usr/bin/env node
const path = require('path');
const colors = require('colors');
const crypto = require('crypto');
const fs = require('fs');

var argv = require('yargs')
    .usage('Usage: $0 [mode] [options] [file...]')
    .example('$0 --encrypt -f file.txt -k key.txt', 'encrypt the file in place')
    .example('$0 --decrypt -f file.txt -k key.txt', 'decrypt the file in place')
    .alias('encrypt', 'e') // Encrypt mode
    .nargs('e', 0)
    .describe('e', 'Encrypt a file')
    .alias('decrypt', 'd') // Decrypt mode
    .nargs('d', 0)
    .describe('d', 'Decrypt a file')
    .alias('f', 'file') // Demand file
    .nargs('f', 1)
    .describe('f', 'Load a file')
    .alias('key', 'K') // Demand key
    .nargs('K', 1)
    .describe('K', 'Give key phrase on command line')
    .alias('keyfile', 'k') // Demand keyfile
    .nargs('k', 1)
    .describe('k', 'Give key phrase on command line')
    .help('h')
    .alias('h', 'help')
    .demandOption(['f'])
    .epilog('Copyright 2017 Cédric JUNG').argv;

const mode = (argv.encrypt && !argv.decrypt ? 'encrypt' : '') || (argv.decrypt && !argv.encrypt ? 'decrypt' : '');
const p = path.join(process.cwd(), argv.file);

if(!require('exists-file').sync(p)) {
  console.error('The file does not exist.'.red);
  process.exit(1);
}

var passphrase = argv.key;

if (!passphrase && argv.keyfile) {
  try {
    passphrase = fs.readFileSync(path.join(process.cwd(), argv.keyfile),'utf8');
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
  console.error('An error occured.'.red);
  console.log(err);
  process.exit(1);
};

if (mode == 'encrypt') {
  const cipher = crypto.createCipher('aes192', new Buffer(passphrase));

  const input = fs.createReadStream(p);
  const output = fs.createWriteStream(p+'.enc');

  input.pipe(cipher).pipe(output);

  fs.unlink(p, function (err) {
    if (err) logErr(err);
    fs.rename(p+'.enc', p, function () {
      if (err) logErr(err);
      console.log('File has been encrypted.'.green);
    });
  });
} else {
  const decipher = crypto.createDecipher('aes192', new Buffer(passphrase));

  const input = fs.createReadStream(p);
  const output = fs.createWriteStream(p+'.dec');

  input.pipe(decipher).pipe(output);

  fs.unlink(p, function (err) {
    if (err) logErr(err);
    fs.rename(p+'.dec', p, function () {
      if (err) logErr(err);
      console.log('File has been decrypted.'.green);
    });
  });
}
