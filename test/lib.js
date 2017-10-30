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
    const [stdout, stderr] = await rsnapshot('-c', _rsnapshotConfig, ...args);

    return [stdout, stderr, b.trim()];
}

// compare directoy contents based on external diff utility
async function compareDirectories(dir1, dir2){

    try{
        // run diff - returncode 0 on success
        const [stdout, stderr] = await _exec('diff', ['-rq', dir1, dir2]);

        return true;
    }catch(e){
        return false;
    }
}

// parse configtest output
function parseConfigtest(data){
    let matches;
    const config = [];

    // config delimiter >>>
    const rule = /^- ([a-z_]+(?: >>> .+?)+)$/gm;

    // parse config entries
    while (match = rule.exec(data)){
        // get args
        const args = match[1].split(' >>> ');

        // push to stack
        config.push(args);
    }

    return config;
}

// expose functions
module.exports = {
    // utilities
    rsnapshot: rsnapshot,
    rsnapshotDynamicConfig: rsnapshotDynamicConfig,
    compareDirectories: compareDirectories,
    parseConfigtest: parseConfigtest,

    // bin paths
    bin: {
        cp:     '/bin/cp',
        rm:     '/bin/rm',
        rsync:  '/usr/bin/rsync',
        ssh:    '/usr/bin/ssh',
        logger: '/usr/bin/logger',
        du:     '/usr/bin/du',
        true:   '/bin/true',
        false:  '/bin/false'
    },

    // conf
    path: {
        snapshotRoot: '/tmp/snapshots',
        data: '/tmp/data'
    }
};