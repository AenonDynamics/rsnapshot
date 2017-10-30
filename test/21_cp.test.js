const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');

describe('copy:gnu_cp/perl_cp', function(){

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

    it('should pass - 3rd snapshot using internal cp', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');

        // validate integrity
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);
    });

    it('should pass - 4th snapshot using internal cp', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');

        // validate integrity
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);
    });
});
