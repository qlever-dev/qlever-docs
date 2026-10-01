# Troubleshooting

## The index build crashes or does not run to completion

A successful index build ends with the log message `[Date] - INFO: Index build
completed`. In the course of the index build, time is spent in the following
phases, each with their own section and progress messages in the log:

1. Parsing triples
2. Merging partial vocabularies
3. Converting triples from local IDs to global IDs
4. Building the various permutations (SPO, SOP, OSP, OPS, PSO, POS)

The index build may fail in any of these phases. Here is a list of things that
may go wrong, and how to fix them.

Regarding 1: If QLever encounters input that it cannot parse, it will abort
with an error message. The error message wlil indicate the byte offset in the
input file where the error was encountered, and it will also contain a part of
the input after that offset.

Regarding 1: The index build just ends with a line like `[Date] - INFO: Triples parsed:
...` and no further error message. This is a sign that the process was killed
by the operating system, most likely due to running out of memory. The most
likely cause is that `num-triples-per-batch` in `SETTINGS_JSON` is set too
high. Set it lower, see [Qleverfile settings](qleverfile.md#section-index).

Regarding 1 or 2: QLever parses the input in batches of size
`num-triples-per-batch` each, or less for the last batch. For each batch, two files
are created on disk: one during parsing and one during the merging of partial
vocabularies. If the number of files exceeds the number of allowed open file
descriptors, there will be a corresponding error message. Set `ULIMIT` higher,
see [Qleverfile settings](qleverfile.md#section-index).

Regarding 2: The index build crashes at `[Date] - INFO: Merging partial
vocabularies ...` and one of the last lines in the log is `Finished writing
compressed internal vocabulary, size = 0 B [uncompressed = 0 B, ratio = 100%]`.
This happens when the `STXXL_MEMORY` divided by the number of batches is too
small. The number of batches is the total number of triples divided by
`"num-triples-per-batch"`. Either increase `STXXL_MEMORY` or increase
`num-triples-per-batch`, see [Qleverfile settings](qleverfile.md#section-index).

Regarding 3: This phase is computationally simple, does not use much memory,
and eventually closes the two files per batch that were created during parsing
and vocabulary merging. We are not aware of any systemic problems occurring in
this phase.

Regarding 4: The index can crash here if `STXLL_MEMORY` is too low or the
number of triples is very large. Increase `STXXL_MEMORY` or make us of
<https://github.com/ad-freiburg/qlever/pull/2443>.

## `qlever start` takes a long time although the server is ready

Symptom: the server log shows `The server is ready, listening for requests on
port ...`, but `qlever start` only returns after a suspiciously long time. The
first `Alive check` in the server log appears only after this delay.

Cause: unless `HOST_NAME` is set, the `qlever` CLI contacts the server via
the machine's own host name (as returned by `hostname`). If DNS resolves that
name to an address that is no longer reachable, `curl` waits for the TCP
connect timeout before trying the next address. A typical case is a home or
office router that still has a DNS record from an old DHCP lease, for example
from another network interface (Wi-Fi vs. Ethernet) of the same machine. This
is why the problem may appear on one network and not on another.

To check, run `dig +short $(hostname)` (or `dscacheutil -q host -a name
$(hostname)` on macOS) and compare the addresses with those of your network
interfaces (`ifconfig` or `ip addr`). Any address that does not belong to the
machine, or that does not answer `ping`, is stale.

Fix: set the host name explicitly in the `[server]` section of the Qleverfile,
see [Qleverfile settings](qleverfile.md#section-server):

```
[server]
HOST_NAME = localhost
```

If the endpoint or the UI started via `qlever ui` must also be reachable from
other machines, use a host name or IP address that resolves correctly
instead, or remove the stale DNS record on the router.
