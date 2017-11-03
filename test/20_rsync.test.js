const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');

describe('rsync', function(){

    before(async function(){
        // prepare environment
        await _lib.cleanEnvironment();
    });
    
    it('should fail - simulated exit code 1 (rsync failed)', async function(){
        try{
            await _lib.rsnapshotDynamicConfig([
                'config_version 1.3',
                `cmd_cp ${_lib.bin.cp}`,
                `cmd_rsync ${_lib.bin.false}`,
                `snapshot_root ${_lib.path.snapshotRoot}`,
                'retain alpha 6',
                `backup ${_lib.path.data} local`
            ], 'alpha');
        
            _assert.fail('An exception should be thrown');
        }catch(e){
            _assert.equal(e.code, 1);
            
            // no directory rotation happend!
            _assert.equal(await _fs.isDirectory(_path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data)), false);
        }
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

    it('should pass - using rsync-long-arg (--no-relative) within config', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'rsync_long_args "--delete --numeric-ids --no-relative --delete-excluded"',
            'retain alpha 6',
            `backup ${_lib.path.data} local`,
        ], 'alpha');

        // validate integrity - no relative path
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local'));
        _assert.equal(equals, true);
    });

    it('should pass - using rsync-long-arg (--no-relative) inline', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local +rsync_long_args=--no-relative`,
        ], 'alpha');

        // validate integrity - no relative path
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local'));
        _assert.equal(equals, true);
    });

    it('should pass - using rsync-short-args (-n) within config', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'rsync_short_args "-an"',
            'retain alpha 6',
            `backup ${_lib.path.data} local`,
        ], 'alpha');

        // dry run, no backup operation should happen
        _assert.equal(await _fs.exists(_path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data)), false);
        
        // directory moved
        _assert.equal(await _fs.isDirectory(_path.join(_lib.path.snapshotRoot, 'alpha.4/local', _lib.path.data)), true);
    });

    it('should pass - using rsync-short-args (-n) inline', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local +rsync_short_args=-n`,
        ], 'alpha');

        // dry run, no backup operation should happen
        _assert.equal(await _fs.exists(_path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data)), false);

        // directory moved
        _assert.equal(await _fs.isDirectory(_path.join(_lib.path.snapshotRoot, 'alpha.5/local', _lib.path.data)), true);
    });

    
});
