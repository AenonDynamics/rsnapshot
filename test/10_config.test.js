const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _testfile = _path.join(__dirname, 'random.bin');

describe('configtest', function(){

    it('should pass - valid, minimal config', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest');
    });

    it('should fail - in case an old config version (1.2) is used', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.2',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
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
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
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
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
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
            `cmd_cp\t${_lib.bin.cp}`,
            `cmd_rm\t${_lib.bin.rm}`,
            `cmd_rsync\t${_lib.bin.rsync}`,
            `snapshot_root\t${_lib.path.snapshotRoot}`,
            'retain\talpha\t6',
            'backup\t/etc/\tlocal'

        ], 'configtest');
    });

    it('should pass - multiple spaces are used as config delimiter', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version    1.3',
            `cmd_cp    ${_lib.bin.cp}`,
            `cmd_rm                   ${_lib.bin.rm}`,
            `cmd_rsync   ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha                          6',
            'backup              /etc/    local'

        ], 'configtest');
    });

    it('should pass - mixed spaces and tabs are used as config delimiter', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version \t\t   1.3',
            `cmd_cp\t   ${_lib.bin.cp}`,
            `cmd_rm\t\t\t\t\t\t${_lib.bin.rm}`,
            `cmd_rsync                        ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain\talpha                          6',
            'backup   /etc/\tlocal',
            'backup\t/etc/\tlocalhost/\tone_fs=1,                       rsync_short_args=-urltvpog'

        ], 'configtest');
    });

    it('should pass - multiple leading/trailing whitespaces', function(){
        return _lib.rsnapshotDynamicConfig([
            '\tconfig_version    1.3',
            `cmd_cp    ${_lib.bin.cp}\t     \t  `,
            `\t   cmd_rm                   ${_lib.bin.rm}`,
            `   \tcmd_rsync   ${_lib.bin.rsync}`,
            `     snapshot_root ${_lib.path.snapshotRoot}  `,
            'retain alpha                          6\t',
            'backup\t/etc/\tlocalhost/\tone_fs=1,                       rsync_short_args=-urltvpog       '

        ], 'configtest');
    });

    it('should pass - parse configtest output', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            'backup /etc/ local'

        ], 'configtest').then(function([stdout, stderr, conf]){
            // parse configtest output
            const config = _lib.parseConfigtest(stdout);

            // check num config elements
            _assert.equal(config.length, 7);
        });
    });
    

});
