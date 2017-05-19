# crypt-in-place

[![Build Status](https://travis-ci.org/cedced19/crypt-in-place.svg?branch=master)](https://travis-ci.org/cedced19/crypt-in-place)

A utility for encypting and decrypting files in place of previous files.

# Installation

With git:
```bash
git clone git+ssh://git@github.com/cedced19/crypt-in-place.git
npm install
```

## Usage

Encrypt:
```
node crypt-in-place.js --encrypt -f file.txt -k key.txt
```
Decrypt:
```
node crypt-in-place.js --decrypt -f file.txt -k key.txt
```

>  The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list-cipher-algorithms will display the available cipher algorithms.
[Source](https://nodejs.org/api/crypto.html)


## Options
```
Usage: crypt-in-place.js [mode] [options] -f [file...]

Options:
  -f, --file       Choose a file or a directory to encrypt or decrypt   [required]
  -h, --help       Show help                                   
  --encrypt, -e    Encrypt a file
  --decrypt, -d    Decrypt a file
  --key, -K        Give key phrase on command line
  --keyfile, -k    Give key phrase on command line
  --algorithm, -a  Give the algorithm to encrypt and decrypt files
  --rename, -r     Rename file with original filename and remove the original file
```

## TODO
 * publish on npm
