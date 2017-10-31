const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');

const _snapshotRootWhitespace = '/tmp/snapshot_root with whitespaces';
const _backupDirWhitespaces = '/tmp/my config with whitespaces';

describe('path', function(){

    before(async function(){
        // prepare environment
        await _lib.cleanEnvironment();
         
        // prepare test paths
        if (!(await _fs.statx(_snapshotRootWhitespace))){
            await _fs.mkdir(_snapshotRootWhitespace);
        }
        if (!(await _fs.statx(_backupDirWhitespaces))){
            await _fs.mkdir(_backupDirWhitespaces);
        }
    });

    it('should pass - valid, minimal config with whitespaces in backup source', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup "${_backupDirWhitespaces}" local`

        ], 'alpha');
    });

    it('should pass - valid, minimal config with whitespaces in backup source with additional arguments', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `backup "${_backupDirWhitespaces}" local +rsync_long_args=--no-relative`

        ], 'alpha');
    });

    it('should pass - valid, minimal config with whitespaces in snapshot root', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root "${_snapshotRootWhitespace}"`,
            'retain alpha 6',
            `backup ${_lib.path.data} local`

        ], 'alpha');
    });

    it('should pass - valid, minimal config with whitespaces in snapshot root and backup source', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 1.3',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root "${_snapshotRootWhitespace}"`,
            'retain alpha 6',
            `backup "${_backupDirWhitespaces}" local`

        ], 'alpha');
    });
    

});
