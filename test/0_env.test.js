const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');

describe('environment', function(){

    it('should pass - <cp> available', function(){
        return _fs.stat(_lib.bin.cp);
    });

    it('should pass - <rm> available', function(){
        return _fs.stat(_lib.bin.rm);
    });

    it('should pass - <rsync> available', function(){
        return _fs.stat(_lib.bin.rsync);
    });

    it('should pass - <ssh> available', function(){
        return _fs.stat(_lib.bin.ssh);
    });

    it('should pass - <logger> available', function(){
        return _fs.stat(_lib.bin.logger);
    });

    it('should pass - <du> available', function(){
        return _fs.stat(_lib.bin.du);
    });

});
