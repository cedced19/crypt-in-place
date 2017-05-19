const crypto = require('crypto');
const fs = require('fs');

module.exports = function (p, algorithm, passphrase, cb) {
  const decipher = crypto.createDecipher(algorithm, new Buffer(passphrase));

  const outputPath = /.*\.enc$/.test(p) ? p.replace(/\.enc$/, '') : p+'.dec';

  const input = fs.createReadStream(p);
  const output = fs.createWriteStream(outputPath);

  input.pipe(decipher).pipe(output);

  fs.unlink(p, function (err) {
    if (err) return cb(err);
    if (!/.*\.enc$/.test(p)) {
      fs.rename(p+'.dec', p, function () {
        if (err) return cb(err);
        cb(null);
      });
    }
  });
};
