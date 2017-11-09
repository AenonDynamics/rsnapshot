[Features](#features) | 
[Documentation](#documentation-and-references) | 
[Installation](#package-installation) | 
[Config File Syntax](#config-file-syntax) | 
[Usage](#usage) | 
[systemd](#automation-via-systemd)

[![Build Status](https://travis-ci.org/AenonDynamics/rsnapshot-ng.svg?branch=ng)](https://travis-ci.org/AenonDynamics/rsnapshot-ng)

RSNAPSHOT-NG
===============================================================================

**rsnapshot-ng comes with ABSOLUTELY NO WARRANTY.**

This is free software, and you are welcome to redistribute it under certain conditions. See the [GNU General Public Licence](LICENSE.txt) for details.

Features
----------------------------------------------------------------------------------

**rsnapshot-ng** is a fork of [rsnapshot](https://github.com/rsnapshot/rsnapshot) including some basic improvements and a modern build/test environment.

* rsnapshot is a filesystem snapshot utility based on rsync. rsnapshot makes it easy to make periodic snapshots of local machines, and remote machines over ssh/rsyncd.
* The code makes **extensive use of hard links** whenever possible, to greatly reduce the disk space required.
* It is written entirely in perl with no module dependencies, and has been tested with versions 5.14 through 5.24. It should work on any reasonably modern UNIX compatible OS.
* The [HOWTO](HOWTO.md) will give you a detailed walk-through on how to get rsnapshot up and running in explicit detail.

Enhancements
------------------------------------------------------

* Config files can contain **spaces** and **tabs** as delimiters
* Pure Perl script without build system - you can used it directly on any device (just modify the config)
* `rsync` output is shown on verbosity level >= 3
* Advanced Javascript based [testcases](test/README.md)

Documentation and References
--------------------------------------------------------------

Some recommended tutorials/usage guides

* [rsnapshot HOWTO](HOWTO.md)
* [archlinux.de - Tutorial](https://wiki.archlinux.de/title/Rsnapshot)
* [ubuntuusers.de - Tutorial](https://wiki.ubuntuusers.de/rsnapshot/)
* [thomas-krenn.com - Backup unter Linux mit rsnapshot](https://www.thomas-krenn.com/de/wiki/Backup_unter_Linux_mit_rsnapshot)

Package Installation
--------------------------------------------------------------

There are currently two different methods available to install rsnapshot-ng

### 1. All Systems - from Source ###

Just download the [latest release from GitHub](https://github.com/AenonDynamics/rsnapshot-ng/releases) and extract the files in a directory of your choice (`/opt/rsnapshot-ng` for example).

### 2. Debian - via Aenon-Dynamics Repository ###

**Add Repository**

See [AenonDynamics/CPR](https://github.com/AenonDynamics/CPR#debian-packages)

**Installation**

```
apt-get update
apt-get install rsnapshot-ng
```

Backward Compatibility
--------------------------------------------------------------

### Breaking Changes ###

* The config file syntax has been changed

### Deprecated Features ###

* The deprecated config directive `interval` has been removed (replaced by `retain`)

### System Requirements ###

* Linux based OS
* At a minimum: `perl` (>= 5.14 required), `rsync` (>=3.1.1 recommended)
* Optionally: `ssh`, `logger`, GNU `cp`, GNU `du`

Config File Syntax
--------------------------------------------------------------

**The config file syntax has changed compared to the classic rsnapshot files.**

Now it's allowed to use any kind of whitespaces (**spaces** and **tabs**) as command/value delimiter. To identify the "new" version you have to set `config_version 2.0` (compatibility)

Syntax: **keyword** `value0` [`value1` [ `value2`]]

**Paths with Whitespaces**

To use whitespaces within paths, just wrap the argument into **double-quotes**

```conf
backup "/etc/my dir with whitespaces" etcbackup/ +rsync_short_args=-z
```

Usage
------------------------------------------------------

Once you have installed rsnapshot, you will need to configure it.
The default configuration file is `/etc/rsnapshot.conf`, although the exact path may be different depending on how the program was installed. 
If this file does not exist, copy `rsnapshot.conf` over to `/etc/rsnapshot.conf` and edit it to suit your tastes.
See the docs for the full list of configuration options.

When `/etc/rsnapshot.conf` contains your chosen settings, do a quick sanity check to make sure everything is ready to go:

**Testing your config**

```terminal
$ rsnapshot configtest
```

**Dry-Run - show what will happen**

If this works, you can see essentially what will happen when you run it for real by executing the following command (where interval is `alpha`, `beta`, `etc`):

```terminal
$ rsnapshot -t [interval]
```

**Backups Stages**

The number of snapshots that are saved depends on the **retain** settings in `/etc/rsnapshot.conf`

```conf
retain alpha 6
```

This means that every time `rsnapshot alpha` is run, it will make a new snapshot, rotate the old ones, and retain the most recent six (`alpha.0` - `alpha.5`).

Note that the backups are done from the highest interval first (in this case `delta`) and go down to the lowest interval.  
If you are not having cron invoke the `alpha` snapshot interval, then you must also ensure that `alpha` is not listed as one of
your intervals in rsnapshot.conf (for example, comment out alpha, so that `beta` becomes the lowest interval).

Remember that it is **only the lowest interval which actually does the rsync to back up the relevant source directories**, the higher
intervals just rotate snapshots around.  Unless you have enabled `sync_first` in your configuration-file, in which case only the `sync`
pseudo-interval does the actual rsync, and all real intervals just rotate snapshots.

Automation via cron
--------------------------------------------------------

**Cronjob Example**

Once you are happy with everything, the final step is to setup a cron job to automate your backups. 
Here is a quick example which makes `alpha` backups **every four hours**, `beta` backups **every day**, `gamma` backups **every tuesday** and `delta` backups **1st of month**

File: `/etc/cron.d/rsnapshot`

```conf
# cron-config - m h dom mon dow <user> <command>

# alpha backups, each 4hours
0 */4 * * * root /usr/bin/rsnapshot alpha

# beta backups, daily @3:00am
0 3 * * * root /usr/bin/rsnapshot beta

# gamma backups, weekly @tuesday 2:40am
40 2 * * 2 root /usr/bin/rsnapshot gamma

# delta backups, monthly 1st @2.20am
20 2 1 * * root /usr/bin/rsnapshot delta
```

Automation via systemd
--------------------------------------------------------

rsnapshot-ng comes with [systemd](https://www.freedesktop.org/wiki/Software/systemd/) based invocation (service+timer) to easily handle backup tasks.

The rsnapshot program is triggerd via a linked systemd-instance [service file](systemd/rsnapshot@.service) - therefore you do not need additional service files.

**Example: Run Tasks alpha+beta manually**

```terminal
systemctl start rsnapshot@alpha.service
systemctl start rsnapshot@beta.service
```

**Example: Run Task alpha automatically**

For each triggerd interval you have to create a custom **systemd-timer** based on the example below.

File: `/etc/systemd/system/rsnapshot-alpha.timer`

```conf
[Unit]
Description=rsnapshot backup task alpha

[Timer]
# Run rsnapshot interval "alpha" at 04:30 am
OnCalendar=04:30

# do NOT start backup immediately if its missed (servers..)
Persistent=false

# linked unit
Unit=rsnapshot@alpha.service

[Install]
WantedBy=timers.target
```

**Enable Timer**
```terminal
systemctl daemon-reload
systemctl enable rsnapshot-alpha.timer
systemctl start  rsnapshot-alpha.timer
```

**View Active Timers**

```terminal
systemctl list-timers

NEXT                         LEFT                LAST                         PASSED       UNIT                         ACTIVATES
Fri 2017-11-10 04:30:00 UTC  17h left            n/a                          n/a          rsnapshot-daily.timer        rsnapshot@alpha.service
Tue 2017-11-14 04:00:00 UTC  4 days left         n/a                          n/a          rsnapshot-weekly.timer       rsnapshot@weekly.service
Fri 2017-12-01 03:50:00 UTC  3 weeks 0 days left n/a                          n/a          rsnapshot-monthly.timer      rsnapshot@monthly.service
```

**Example: daily/weekly/monthly schedules**

A common used backup scheme/configuration is available within the [systemd/ directory](systemd/) including pre-configured timers:

* [daily](systemd/rsnapshot-daily.timer) timer
* [weekly](systemd/rsnapshot-weekly.timer) timer
* [monthly](systemd/rsnapshot-monthly.timer) timer

Authors
--------------------------------------------------------

Please see the [AUTHORS](AUTHORS.md) file for the complete list of contributors.

License
-------

**rsnapshot-ng** is OpenSource and licensed under the Terms of [GNU General Public Licence v2](LICENSE). You're welcome to [contribute](CONTRIBUTE.md)!

Many Thanks to the contributors of [rsnapshot](https://github.com/rsnapshot/rsnapshot) and [Mike Rubel](http://www.mikerubel.org/computers/rsync_snapshots/) author of rsync_snapshots