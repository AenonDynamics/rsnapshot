const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');

describe('backup_exec', function(){

    before(async function(){
        // prepare environment
        await _lib.cleanEnvironment();
    });

    it('should pass - backup_exec with required flag set returns success', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.true} required`

        ], 'configtest');
    });

    it('should pass - backup_exec without flag (default=optional) set returns success', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.true}`

        ], 'configtest');
    });

    it('should pass - backup_exec with optional flag set returns success', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.true} optional`

        ], 'configtest');
    });

    it('should fail - backup_exec with required flag set returns error', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.false} required`

        ], 'configtest');
    });

    it('should pass - backup_exec without flag (default=optional) set returns error', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.false}`

        ], 'configtest');
    });

    it('should pass - backup_exec with optional flag set returns error', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.false} optional`

        ], 'configtest');
    });

    it('should pass - multiple backup_exec directives used, non of them throws an error', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup_exec ${_lib.bin.true}`,
            `backup_exec ${_lib.bin.true} optional`,
            `backup_exec ${_lib.bin.true} required`,
            `backup_exec ${_lib.bin.false} optional`,
            `backup_exec ${_lib.bin.false}`

        ], 'configtest');
    });

});
