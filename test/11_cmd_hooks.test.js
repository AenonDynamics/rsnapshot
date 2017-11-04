const _lib = require('./lib');
const _path = require('path');
const _assert = require('assert');
const _fs = require('fs-magic');

describe('cmd', function(){

    before(async function(){
        // prepare environment
        await _lib.cleanEnvironment();
    });

    it('should pass - preexec=success, postexec=success (with arguments; snapshot created)', async function(){
        await _lib.rsnapshotDynamicConfig([
            'config_version 2.0',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `cmd_preexec  "${_lib.bin.echo} 1 > ${_lib.path.flags}/cmd_pre_1"`,
            `cmd_postexec "${_lib.bin.echo} 1 > ${_lib.path.flags}/cmd_post_1"`,
            `backup ${_lib.path.data} local`

        ], 'alpha');

        // validate integrity
        const equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);

        // flags set ?
        _assert.equal(await _lib.isFlagSet('cmd_pre_1', '1'), true);
        _assert.equal(await _lib.isFlagSet('cmd_post_1', '1'), true);


        //`cmd_preexec ${_lib.bin.true}`,
        //`cmd_postexec ${_lib.bin.true}`,
    });

    it('should fail - preexec=fail, postexec=success (no snapshot created; postexec not executed)', async function(){
        try{
            await _lib.rsnapshotDynamicConfig([
                'config_version 2.0',
                `cmd_cp ${_lib.bin.cp}`,
                `cmd_rm ${_lib.bin.rm}`,
                `cmd_rsync ${_lib.bin.rsync}`,
                `snapshot_root ${_lib.path.snapshotRoot}`,
                'retain alpha 6',
                `cmd_preexec ${_lib.bin.false}`,
                `cmd_postexec "${_lib.bin.echo} 2 > ${_lib.path.flags}/cmd_post_2"`,
                `backup ${_lib.path.data} local`

            ], 'alpha');

            _assert.fail('An exception should be thrown');
        }catch(e){
            _assert.equal(e.code, 1);
        }

        // 1 backup should be available

        // validate integrity 1
        let equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);

        // backup 2 should not exists
        _assert.equal(await _fs.isDirectory(_path.join(_lib.path.snapshotRoot, 'alpha.1/local', _lib.path.data)), false);

        // flags set ?
        _assert.equal(await _lib.isFlagSet('cmd_post_2'), false);
    });

    it('should fail - preexec=success, postexec=fail (snapshot created)', async function(){
        try{
            await _lib.rsnapshotDynamicConfig([
                'config_version 2.0',
                `cmd_cp ${_lib.bin.cp}`,
                `cmd_rm ${_lib.bin.rm}`,
                `cmd_rsync ${_lib.bin.rsync}`,
                `snapshot_root ${_lib.path.snapshotRoot}`,
                'retain alpha 6',
                `cmd_postexec ${_lib.bin.false}`,
                `cmd_preexec "${_lib.bin.echo} 1 > ${_lib.path.flags}/cmd_pre_3"`,
                `backup ${_lib.path.data} local`

            ], 'alpha');

            _assert.fail('An exception should be thrown');
        }catch(e){
            _assert.equal(e.code, 1);
        }

        // 2 backups should be available

        // validate integrity 1
        let equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.0/local', _lib.path.data));
        _assert.equal(equals, true);

        equals = await _lib.compareDirectories(_lib.path.data, _path.join(_lib.path.snapshotRoot, 'alpha.1/local', _lib.path.data));
        _assert.equal(equals, true);

        // flags set ?
        _assert.equal(await _lib.isFlagSet('cmd_pre_3', '1'), true);
    });

    it('should fail - preexec=fail, postexec=fail', function(){
        return _lib.rsnapshotDynamicConfig([
            'config_version 2.0',
            `cmd_cp ${_lib.bin.cp}`,
            `cmd_rm ${_lib.bin.rm}`,
            `cmd_rsync ${_lib.bin.rsync}`,
            `snapshot_root ${_lib.path.snapshotRoot}`,
            'retain alpha 6',
            `cmd_preexec ${_lib.bin.false}`,
            `cmd_postexec ${_lib.bin.false}`,
            `backup ${_lib.path.data} local`

        ], 'alpha')

        .then(function(result){
            _assert.fail('An exception should be thrown');
        }).catch(function(e){
            _assert.equal(e.code, 1);
        });
    });

    it('should fail - preexec=success, postexec=success, backup=fail (postexec not executed)', async function(){
         try{
            await _lib.rsnapshotDynamicConfig([
                'config_version 2.0',
                `cmd_cp ${_lib.bin.cp}`,
                `cmd_rm ${_lib.bin.rm}`,
                `cmd_rsync ${_lib.bin.rsync}`,
                `snapshot_root ${_lib.path.snapshotRoot}`,
                'retain alpha 6',
                `cmd_preexec  "${_lib.bin.echo} 1 > ${_lib.path.flags}/cmd_pre_5"`,
                `cmd_postexec "${_lib.bin.echo} 1 > ${_lib.path.flags}/cmd_post_5"`,
                `backup_exec ${_lib.bin.false} required`

            ], 'alpha');

            _assert.fail('An exception should be thrown');
        }catch(e){
            _assert.equal(e.code, 1);
        }

        // flags set ?
        _assert.equal(await _lib.isFlagSet('cmd_pre_5', '1'), true);
        _assert.equal(await _lib.isFlagSet('cmd_post_5'), false);
    });
});
