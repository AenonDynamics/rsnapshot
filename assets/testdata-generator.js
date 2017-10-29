const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');
const _async = require('async-magic');
const _crypto = require('crypto');
const _random = _async.promisify(_crypto.randomBytes);

const cc_nato = ['ALFA','BRAVO','CHARLIE','DELTA','ECHO','FOXTROT','GOLF','HOTEL','INDIA','JULIETT','KILO','LIMA','MIKE','NOVEMBER','OSCAR','PAPA','QUEBEC','ROMEO','SIERRA','TANGO','UNIFORM','VICTOR','WHISKEY','XRAY','YANKEE','ZULU'];
const cc_numberstext = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
const cc_greek = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA', 'THETA', 'IOTA', 'KAPPA', 'LAMBDA', 'MU', 'NU', 'XI', 'OMICRON', 'PI', 'RHO', 'SIGMA', 'TAU', 'UPSILON', 'PHI', 'CHI', 'PSI', 'OMEGA'];
const _basedir = '/tmp/data';

async function createFiles(dir){
    // create N random data buffers 8k and write them to files
    await Promise.all(cc_nato.map(async function(filename){
        const data = await _random(8192);

        return await _fs.writeFile(_path.join(dir, filename + '.bin'), data);
    }));
}

// simple testdata generator
(async function(){

    try{

        // testdata storage
        await _fs.mkdir(_basedir);

        // create 1st level structure
        await Promise.all(cc_greek.map(f => _fs.mkdir(_path.join(_basedir, f))));

        // create 2nd level structure
        for (let i=0;i<cc_greek.length;i++){
            await Promise.all(cc_numberstext.map(f => _fs.mkdir(_path.join(_basedir, cc_greek[i], f))));

            // create files
            await Promise.all(cc_numberstext.map(f => createFiles(_path.join(_basedir, cc_greek[i], f))));
        };

    }catch(e){
        console.error(e);
    }
})();