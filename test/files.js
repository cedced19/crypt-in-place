const assert = require('assert');
const randomstring = require('randomstring');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const exec = require('child_process').exec;


describe('Encrypt and decrypt a file', function() {
    const filepath = path.join(process.cwd(), '/test/.tmp/', randomstring.generate() + '.txt');
    const filecontent = randomstring.generate();
    const key = randomstring.generate();

    beforeEach(function(done) {
        fs.mkdir(path.join(process.cwd(), '/test/.tmp/'), (err) => {
            if (err) return done(err);
            fs.writeFile(filepath, filecontent, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('with key passed throught cli', function() {

        it('should encrypt and decrypt a file', function(done) {
            exec(`node crypt-in-place.js --encrypt -f ${filepath} -K ${key}`, (err, stdout, stderr) => {
                if (err) return done(err)
                exec(`node crypt-in-place.js --decrypt -f ${filepath}.enc -K ${key}`, (err, stdout, stderr) => {
                    if (err) return done(err)
                    fs.readFile(filepath, (err, data) => {
                        if (err) return done(err);
                        assert.equal(data, filecontent);
                        done();
                    });
                });
            });
        });

        it('should encrypt (with -r option) and decrypt a file', function(done) {
            exec(`node crypt-in-place.js --encrypt -f ${filepath} -K ${key} -r`, (err, stdout, stderr) => {
                if (err) return done(err)
                exec(`node crypt-in-place.js --decrypt -f ${filepath} -K ${key}`, (err, stdout, stderr) => {
                    if (err) return done(err)
                    fs.readFile(filepath, (err, data) => {
                        if (err) return done(err);
                        assert.equal(data, filecontent);
                        done();
                    });
                });
            });
        });
    });

    describe('with key passed throught a key file', function() {

        const keypath = path.join(process.cwd(), '/test/.tmp/', randomstring.generate() + '.txt');
        const keycontent = randomstring.generate();

        beforeEach(function(done) {
            fs.writeFile(keypath, keycontent, (err) => {
                if (err) return done(err);
                done();
            });
        });

        it('should encrypt and decrypt a file', function(done) {
            exec(`node crypt-in-place.js --encrypt -f ${filepath} -k ${keypath}`, (err, stdout, stderr) => {
                if (err) return done(err)
                exec(`node crypt-in-place.js --decrypt -f ${filepath}.enc -k ${keypath}`, (err, stdout, stderr) => {
                    if (err) return done(err)
                    fs.readFile(filepath, (err, data) => {
                        if (err) return done(err);
                        assert.equal(data, filecontent);
                        done();
                    });
                });
            });
        });
    });


    afterEach(function(done) {
        rimraf(path.join(process.cwd(), '/test/.tmp/'), (err) => {
            if (err) return done(err);
            done();
        });
    });
});
