const crypto = require('crypto');
const fs = require('fs');

module.exports = function (p, algorithm, passphrase, cb) {
  const cipher = crypto.createCipher(algorithm, new Buffer(passphrase));

  const input = fs.createReadStream(p);
  const output = fs.createWriteStream(p+'.enc');

  input.pipe(cipher).pipe(output);

  fs.unlink(p, function (err) {
    if (err) return cb(err);
    cb(null)
  });
}
