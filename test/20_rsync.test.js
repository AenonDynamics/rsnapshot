const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');

describe('rsync', function(){

    before(async function(){
        // prepare environment
        await _lib.cleanEnvironment();
    });
    
    it('should pass - 1st snapshot using GNU cp', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');

        // validate integrity
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);
    });

    it('should pass - 2nd snapshot using GNU cp', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');

        // validate integrity
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);
    });

    it('should fail - simulated exit code 1 (rsync failed)', async function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.false}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha')
        
        .then(function(result){
            _assert.fail('An exception should be thrown');
        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });
});
