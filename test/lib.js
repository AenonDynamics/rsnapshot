const _async = require('async-magic');
const _fs = require('fs-magic');
const _path = require('path');
const _assert = require('assert');
const _childProcess = require('child_process');
const _exec = _async.promisify(_childProcess.execFile, 'exec');
const _rsnapshotBin = _path.join(__dirname, '../rsnapshot');
const _rsnapshotConfig = _path.join('/tmp', 'rsnapshot.conf');

// rsnapshot execution wrapper
// run perl interpreter with binary present in root dir and given args
async function rsnapshot(...args){

    // run rsnapshot
    const [stdout, stderr] = await _exec('perl', [_rsnapshotBin, ...args]);

    return [stdout, stderr];
}

// run rsnapshot with dynamic generated config
async function rsnapshotDynamicConfig(config, ...args){
    let b = '';

    config.forEach(function(line){
        b += line + "\n";
    });

    // write file
    await _fs.writeFile(_rsnapshotConfig, b, 'utf8');

    // run rsnapshot with tmp config
    return await rsnapshot('-c', _rsnapshotConfig, ...args);
}

// compare directoy contents based on sha256 hash tables
async function compareDirectories(dir1, dir2){
    // fetch file lists
    const [files1, dirs1] = await _fs.scandir(dir1, true, true);
    const [files2, dirs2] = await _fs.scandir(dir2, true, true);

    // num files, directories equal ?
    if (files1.length != files2.length){
        throw new Error('The directories containing a different number of files ' + files1.length + '/' + files2.length);
    }
    if (dirs1.length != dirs2.length){
        throw new Error('The directories containing a different number of subdirectories ' + dirs1.length + '/' + dirs2.length);
    }

    // generate file checksums
    const hashes1 = await Promise.all(files1.map(f => _fs.sha256file(f)));
    const hashes2 = await Promise.all(files2.map(f => _fs.sha256file(f)));

    // convert arrays to objects filename=>hash
    const lookup = {};
    for (let i=0;i<hashes2.length;i++){
        // normalized filenames
        const f2 = files2[i].substr(dir2.length);
        
        // assign
        lookup[f2] = hashes2[i];
    }

    // compare dir1 to dir2
    for (let i=0;i<hashes1.length;i++){
        // normalized filenames
        const f1 = files1[i].substr(dir1.length);

        // exists ?
        if (!lookup[f1]){
            throw new Error('File <' + files1[i] + '> does not exist in <' + dir2 + '>');
        }

        // hash valid ?
        if (lookup[f1] !== hashes1[i]){
            throw new Error('File Checksum of <' + files1[i] + '> does not match <' + files2[i] + '>');
        }
    }

    return true;
}

// expose functions
module.exports = {
    rsnapshot: rsnapshot,
    rsnapshotDynamicConfig: rsnapshotDynamicConfig,
    compareDirectories: compareDirectories,

    // bin paths
    bin: {
        cp:     '/bin/cp',
        rm:     '/bin/rm',
        rsync:  '/usr/bin/rsync',
        ssh:    '/usr/bin/ssh',
        logger: '/usr/bin/logger',
        du:     '/usr/bin/du'
    },

    // conf
    path: {
        snapshotRoot: '/tmp/snapshots',
        data: '/tmp/data'
    }
};