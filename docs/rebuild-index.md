# Rebuild Index (beta)

QLever currently distinguishes between triples that are part of the original
dataset (pre-processed by QLever via the `qlever index` command) and triples
added or modified via update operations (`INSERT`, `DELETE`, and the various
Graph Store Protocol operations).

QLever's data structures for the original triples are highly compressed and
optimized for query processing. The data structures for the update triples are
currently less optimized. The performance difference is negligible when the
number of update triples is small compared to the number of original triples,
but it becomes significant when there are many update triples.

Eventually, QLever will work the update triples into its main index data
structures automatically via a continuous background process. Until this
feature is available, a good workaround is to periodically rebuild the index
for the entire dataset (original triples and update triples). In principle,
this can be done by first exporting the entire dataset and then call `qlever
index` on the exported data. However, this is inefficient, as it requires
serializing all triples to disk and then reading them back.

To rebuild the index efficiently, QLever provides the command `qlever
rebuild-index`, which directly rebuilds the index from the existing data
structures. With a Ryzen 9 9950X (16 cores) and NVMe SSD, this takes less than
one minute for 500 million triples, and around 15 minutes for 10 billion
triples.

## Usage

The feature is not yet part of the QLever master branch. It is available via
the Docker image `qlever/qlever:REBUILD-INDEX-BETA`, or, if you want to build
QLever from source, via https://github.com/ad-freiburg/qlever/pull/2408.

In its simplest form, you can just call `qlever rebuild-index` (you need
version `0.5.37` or later for this). This will create a new index in a
subdirectory `rebuild.YYYY-MM-DDTHH:MM' of the current directory, with the same
base name as the current index. You can specify a different base name via the
option `--index-name`, and a different target directory with the option
`--index-dir'. To automatically restart the server once the rebuild is
complete, use the option `--restart-when-finished`. Alternatively, you can
trigger the rebuild via the QLever HTTP API as described below.

=== "qlever CLI"
    ``` bash
    qlever rebuild-index [--index-[--index-dir PATH] [--restart-when-finished]
    ```
=== "curl"
    ``` bash
    curl -s http://$HOST:$PORT -d cmd=rebuild-index -d access-token=$ACCESS_TOKEN [-d index-name=$PATH/$BASE_NAME]
    ```
## Limitations

There is currently no way to transition from the old index to the new index
without any interruption. When you restart the server (e.g., via the
`--restart-when-finished` option), all processing of queries with the old index
will stop, and the respective clients have to issue their queries again.
Restarting the server is very fast, so the interruption is short, but there
will be an interruption nonetheless.

If avoiding even short interruptions is important for your application, you
could start a server with the new index on a different port, and have a 
middleman server that routes queries to the new server once it is ready, and
shut down the old server once it processes no more queries. Eventually, this
functionality will be built into QLever.

For rebuilding the index, you need disk space for both the old and the new
index. Once the rebuild is complete, and the old index is no longer needed for
query processing, you can delete it. Eventually, QLever will rebuild the index
continuously in the background, so that this extra disk space will not be
needed anymore.
