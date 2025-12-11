# Frequently asked questions

## Does QLever run on Windows and MacOS?

The [`qlever` command-line tool](quickstart.md) uses the official
Docker image of QLever by default. Docker runs natively on Linux, with only a
small performance penalty. However, on Windows and MacOS, Docker runs inside a
virtual machine, which may incur a significant performance penalty. In
particular, RAM consumption may be prohibitive. We are working towards binary
releases for Windows and MacOS. In the meantime, we strongly recommend using
QLever on a Linux machine.

## Can QLever read compressed files or multiple files?

Yes, QLever can process multiple input streams produced by arbitrary commands
supported by your system. See the options `CAT_INPUT_FILES` and
`MULTI_INPUT_FILES` in the [Qleverfile settings](qleverfile.md#section-index).

## My index build runs out of memory, what can I do?

If you have a large input set or a machine with little RAM, you should
carefully set `STXXL_MEMORY`, `ULIMIT`, and `SETTINGS_JSON`. See the
explanations in the [Qleverfile settings](qleverfile.md#section-index).

## I have problems or I think I found a bug, what can I do?

Please first search <https://github.com/ad-freiburg/qlever/issues>, maybe your
issue has already been reported or solved. If it has been reported before but
is not yet solved, please add a comment to the existing issue. If it has not
been reported before, please open a new issue. Please provide as much detail as
possible, including the exact command you ran, the content of your `Qleverfile`
(if applicable), and the relevant output. And try to provide a minimal example
(in particular, a minimal SPARQL query) that reproduces the issue.

## Does QLever have releases?

We currently treat every commit to the `master` branch as a release. In
particular, each commit comes with a detailed description and an own Docker
image on <https://hub.docker.com/r/adfreiburg/qlever/>, tagged with the commit
hash as well as with the corresponding pull request number. Each commit is
extensively tested and reviewed before being merged into the QLever `master`.

## Are there publications about QLever?

Yes, see the README of <https://github.com/ad-freiburg/qlever>.
