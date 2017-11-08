[Features](#features) | 
[Documentation](#documentation-and-references) | 
[Backward Compatibility](#backward-compatibility) | 
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


System Requirements
--------------------------------------------------------------

* Linux based OS
* At a minimum: `perl` (>= 5.14 required), `rsync` (>=3.1.1 recommended)
* Optionally: `ssh`, `logger`, GNU `cp`, GNU `du`

Backward Compatibility
--------------------------------------------------------------

### Breaking Changes ###

* The config file syntax has been changed

### Deprecated Features ###

* The deprecated config directive `interval` has been removed (replaced by `retain`)

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

If this works, you can see essentially what will happen when you run it for real by executing the following command (where interval is `alpha`, `beta`, `etc`):

```terminal
$ rsnapshot -t [interval]
```

**Cronjob Example**

Once you are happy with everything, the final step is to setup a cron job to automate your backups. 
Here is a quick example which makes backups every four hours, and beta backups for a week:

```conf
0 */4 * * *     /usr/local/bin/rsnapshot alpha
50 23 * * *     /usr/local/bin/rsnapshot beta
```

**Single Backup Interval**

In the previous example, there will be six `alpha` snapshots taken each day (at 0,4,8,12,16, and 20 hours). There will also
be beta snapshots taken every night at 11:50PM. The number of snapshots that are saved depends on the **retain** settings in `/etc/rsnapshot.conf`

```conf
retain alpha 6
```

This means that every time `rsnapshot alpha` is run, it will make a new snapshot, rotate the old ones, and retain the most recent six (`alpha.0` - `alpha.5`).

**Multiple Backup Stages/Intervals**

If you prefer instead to have three levels of backups (which we'll call `beta`, `gamma` and `delta`), you might set up cron like this:

```conf
00 00 * * *     /usr/local/bin/rsnapshot beta
00 23 * * 6     /usr/local/bin/rsnapshot gamma
00 22 1 * *     /usr/local/bin/rsnapshot delta
```

This specifies a `beta` rsnapshot at midnight, a `gamma` snapshot on Saturdays at 11:00pm and a `delta` rsnapshot at 10pm on the first day of each month.

Note that the backups are done from the highest interval first (in this case `delta`) and go down to the lowest interval.  
If you are not having cron invoke the `alpha` snapshot interval, then you must also ensure that `alpha` is not listed as one of
your intervals in rsnapshot.conf (for example, comment out alpha, so that `beta` becomes the lowest interval).

Remember that it is **only the lowest interval which actually does the rsync to back up the relevant source directories**, the higher
intervals just rotate snapshots around.  Unless you have enabled `sync_first` in your configuration-file, in which case only the `sync`
pseudo-interval does the actual rsync, and all real intervals just rotate snapshots.

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
sytemctl enable rsnapshot-alpha.timer
```

Authors
--------------------------------------------------------

Please see the [AUTHORS](AUTHORS.md) file for the complete list of contributors.

License
-------

**rsnapshot-ng** is OpenSource and licensed under the Terms of [GNU General Public Licence v2](LICENSE.txt). You're welcome to [contribute](CONTRIBUTE.md)!

Many Thanks to the contributors of [rsnapshot](https://github.com/rsnapshot/rsnapshot) and [Mike Rubel](http://www.mikerubel.org/computers/rsync_snapshots/) author of rsync_snapshots