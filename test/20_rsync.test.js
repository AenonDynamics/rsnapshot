const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');

describe('rsync', function(){

    it('should pass - 1st snapshot using GNU cp', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');
    });

    it('should pass - 2nd snapshot using GNU cp', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');
    });

    it('should pass - 3rd snapshot using internal cp', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`
        ], 'alpha');
    });
});
