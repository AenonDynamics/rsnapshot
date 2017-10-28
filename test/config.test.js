const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _testfile = _path.join(__dirname, 'random.bin');

describe('configtest', function(){

    it('should pass - valid, minimal config', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            _lib.conf.snapshotRoot,
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest');
    });

    it('should fail - in case an old config version (1.2) is used', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.2',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            _lib.conf.snapshotRoot,
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest').then(function(result){
            _assert.fail('An exception should be thrown');

        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });

    it('should fail - no_create_root has been set and the directory is missing', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            'snapshot_root /tmp/12345678',
            'no_create_root 1',
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest').then(function(result){
            _assert.fail('An exception should be thrown');

        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });

    it('should pass - no_create_root has been disable and the directory is missing', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            'snapshot_root /tmp/12345678',
            'no_create_root 0',
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest');
    });

    it('should fail - config file does not exist (default /etc/rsnapshot.conf)', function(){
        return _lib.rsnapshot('configtest').then(function(result){
            _assert.fail('An exception should be thrown');
        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });

    it('should fail - user defined config file does not exist (-c option)', function(){
        return _lib.rsnapshot('-c', '/tmp/unknown-config-file', 'configtest').then(function(result){
            _assert.fail('An exception should be thrown');
        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });

    it('should pass - tabs are used as config delimiter', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version\t1.3',
            _lib.cmd.cp.replace(/\s/g, '\t'),
            _lib.cmd.rm.replace(/\s/g, '\t'),
            _lib.cmd.rsync.replace(/\s/g, '\t'),
            _lib.conf.snapshotRoot.replace(/\s/g, '\t'),
            'retain\talpha\t6',
            'backup\t/etc/\tlocal'

        ], 'configtest');
    });

    it('should pass - multiple spaces are used as config delimiter', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version    1.3',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            _lib.conf.snapshotRoot,
            'retain alpha                          6',
            'backup              /etc/    local'

        ], 'configtest');
    });

    it('should pass - mixed spaces and tabs are used as config delimiter', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version \t\t   1.3',
            _lib.cmd.cp,
            _lib.cmd.rm,
            _lib.cmd.rsync,
            _lib.conf.snapshotRoot,
            'retain\talpha                          6',
            'backup   /etc/\tlocal',
            'backup\t/etc/\tlocalhost/\tone_fs=1,                       rsync_short_args=-urltvpog'

        ], 'configtest');
    });

});
