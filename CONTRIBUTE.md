Developer Notes
================================================

This file is intended for developers and packagers of rsnapshot, not for regular users. 
If you want to contribute, it's a good idea to read this document.

## Bug tracker ##

The bug tracker is hosted on [Github](https://github.com/AenonDynamics/rsnapshot-ng/issues). Please don't report any issues in the tracker on Sourceforge.

## Source code control ##

The rsnapshot source code is on [Github](https://github.com/AenonDynamics/rsnapshot-ng).

## Opening Issues ##

If you have found a bug, open an issue-report on Github. Before you open a report, please search if there are corresponding issues already opened or whether the bug has already been fixed on the `ng` branch. 
Please provide the rsnapshot-version, and describe how to reproduce the bug including a **minimal exmaple**. It would be great if you could provide also a fix.

## Development ##

The `ng` branch should be complete, by which we mean that there should be no half-completed features in it. Any development should be done in a separate branch, each of them containing only a single feature or bugfix.

### Coding standards ###

Changes that do not conform to the coding standard will not be accepted. The current coding standard is primarily encapsulated in the code itself. However briefly:

 * Use whitespaces - no tabs.
 * There should be no trailing white space on any lines.

### Adding features ###

Fork the repository and open a new branch prefixed with `feature/`. Keep the name short and descriptive. Before opening a Pull-Request against the main repository, make sure that:

 * you have written tests, which test the functionality
 * all the tests pass
 * your commits are logically ordered
 * your commits are clean

If it is not the case, please rebase/revise your branch. When you're finished you can create a pull request. Your changes will then be reviewed by a team member, before they can get merged into `ng`.

### Fixing Bugs ###

Create a new branch, prefix it with `issue/` and, if available, the github issue number. (e.g. `issue/35-umount-lvm`).

* Add your commits to the branch. They should be logically ordered and clean. Rebase them, if neccessary. 
* Make sure that `npm test` passes
* Finished? Open a pull-request!
* The code will get reviewed
* If the review passes, a project-member will merge it onto `ng` branch

### Test cases ###

We encourage you to write a test case for your pull-request.  We can verify your changes and intentions easier.

1. The testcases are based on **Javascript/ES2017** and [mocha](https://mochajs.org)
2. Testcases are located within the `test/` directory
3. Each test-type has its own numerical prefix. New features should be named **80_featurexxx.test.js**
4. Write your tests (take a look into the existing files) and of course test them.
