# crypt-in-place

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

## TODO
 * add recursive mode
 * publish on npm
