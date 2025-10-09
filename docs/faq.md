# Frequently asked questions

## Does QLever run on Windows and MacOS?

The <a href="quickstart/">`qlever` command-line tool</a> uses the official
Docker image of QLever by default. Docker runs natively on Linux, with only a
small performance penalty. However, on Windows and MacOS, Docker runs inside a
virtual machine, which may incur a significant performance penalty. In
particular, RAM consumption may be prohibitive. We are working towards binary
releases for Windows and MacOS. In the meantime, we strongly recommend using
QLever on a Linux machine.

## I have problems or I think I found a bug, what can I do?

Please first search https://github.com/ad-freiburg/qlever/issues, maybe your
issue has already been reported or solved. If it has been reported before but
is not yet solved, please add a comment to the existing issue. If it has not
been reported before, please open a new issue. Please provide as much detail as
possible, including the exact command you ran, the content of your `Qleverfile`
(if applicable), and the relevant output. And try to provide a minimal example
(in particular, a minimal SPARQL query) that reproduces the issue.

## Does QLever have releases?

We currently treat every commit to the `master` branch as a release. In
particular, each commit comes with a detailed description and an own Docker
image on https://hub.docker.com/r/adfreiburg/qlever/. Each commit is
extensively tested and reviewed before being merged into `master`.

## Are there publications about QLever?

Yes, see the README of https://github/ad-freiburg/qlever.
