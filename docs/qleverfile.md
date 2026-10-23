# Qleverfile settings

The `Qleverfile` contains the full configuration for the `qlever` command, see
[Quickstart](quickstart.md). The variables in the `Qleverfile` are written in
`UPPER_SNAKE_CASE` and are grouped into sections. The sections are
`[data]`, `[index]`, `[server]`, `[runtime]`, and `[ui]`. See
<https://github.com/qlever-dev/qlever-control/tree/main/src/qlever/Qleverfiles>
for a wide selection of example Qleverfiles.

For each `Qleverfile` variable, there is a corresponding command-line option for
one or more of the `qlever` commands, which are written in `--snake-case`. For
example, the `Qleverfile` variable `ACCESS_TOKEN` corresponds to the
`--access-token` option of the commands `qlever start`, `qlever settings`,
`qlever clear-cache`, and `qlever query`.

The command-line option always takes precedence over the `Qleverfile` variable,
in case both are specified. There are some command-line options that are
specific to a command and do not have a corresponding `Qleverfile` variable.
For example, the option `--kill-existing-with-same-port` of `qlever start`,
which does what the name suggests.

The following sections describe all `Qleverfile` variables and their
corresponding command-line options, with their respective default values. The
options specific to a particular command are not listed here, you get them
via `qlever <command> --help`.

If a variable is missing from the documentation below, please [open an
issue](https://github.com/qlever-dev/qlever-docs/issues). In the meantime, you
can always resort to `qlever <command> --help`. If the variable / option exists,
it will be listed there.

## Section `[data]`

`NAME`, `--name`: The base name of all files created by various `qlever`
commands. We strongly recommend to stick to the convention to have one separate
directory for each dataset (with a `Qleverfile` in it). The name of the
directory is up to you. Default: none.

`GET_DATA_CMD`, `--get-data-cmd`: The command invoked by `qlever get-data` to
obtain the dataset. This can be anything that works on your system; see the
many [example Qleverfiles](https://github.com/qlever-dev/qlever-control/tree/main/src/qlever/Qleverfiles).
Default: none.

`DESCRIPTION`, `--description`: A concise description of the dataset, set by
`qlever index`. Default: none.

`TEXT_DESCRIPTION`, `--text-description`: A concise description of the
additional text data if any, set by `qlever index`. Default: none.

`FORMAT`, `--format`: The format of the data, one of `ttl`, `nt`, or `nq`. Default:
`ttl`.

## Section `[index]`

`INPUT_FILES`, `--input-files`: A space-separated list of input files or patterns
(you can use `*` and `?` as wildcards). This is used in two ways. First,
`qlever index` checks whether these files exist, and if not, reports an error.
Second, it is often useful (but not mandatory) to use this variable in your
definition of `CAT_INPUT_FILES` or `MULTI_JSON_INPUT`, see the many
[example Qleverfiles](https://github.com/qlever-dev/qlever-control/tree/main/src/qlever/Qleverfiles).
Default: none.

`CAT_INPUT_FILES`, `--cat-input-files`: The command used to create a single
input stream for `qlever index`. This can be any command that works on your
system, see the many [example Qleverfiles](https://github.com/qlever-dev/qlever-control/tree/main/src/qlever/Qleverfiles).
In particular, you can use commands like `zcat` or `bzcat` or `xzcat`, in order
to read compressed files directly. Default: none.

`PARALLEL_PARSING`, `--parallel-parsing`: Whether to parse the single input
stream in parallel (`true`) or sequentially (`false`). Parallel parsing is much
faster, but requires that all prefix declarations are at the beginning of the
input stream. Default: `true` if you use `CAT_INPUT_FILES`, but deprecated to
encourage setting it explicitly or using `MULTI_INPUT_JSON` instead.

`MULTI_INPUT_JSON`, `--multi-input-json`: A comma-separated list of JSON
objects to define multiple input streams for `qlever index`. Each JSON object
must specify a `"cmd"` (the command that produces the input stream) and a
`"format"` (one of `ttl`, `nt`, or `nq`), and can optionally specify a
`"graph"` (the name of the graph to which the triples from this input stream
are added, use `-` for the default graph) and `"parallel"` (`"true"` if this
input stream should be parsed in parallel, which is faster but requires that
all prefix declarations are at the beginning of the input stream, or `"false"`
if not). Additionally, each JSON object can specify `"for-each"` (a
space-separated list of files or patterns), with the effect that the command
from `"cmd"` is run once for each file matching one of the patterns, with `{}`
in the command replaced by the file name. In particular, this is useful if you
have many files that belong to the same graph and have the same format.
Default: none.

`SETTINGS_JSON`, `--settings-json`: A JSON object (as a string) that can be
used to pass additional settings for `qlever index`. The recognized keys are
documented in [`SETTINGS_JSON` keys](#settings_json-keys) at the end of this
page. This exists for historical reasons and will be deprecated soon, with the
individual keys migrated to their own `Qleverfile` variables.

`ULIMIT`, `--ulimit`: The maximum number of open files allowed during `qlever
index`. If this number is too low, `qlever index` will fail with an error that
will make it clear that you need to increase this value. Default: depends on
your system, but is often as low as `1024` (which is too low for large
datasets).

`STXXL_MEMORY`, `--stxxl-memory`: The amount of memory that can be used by
`qlever index`, specified with standard suffixes like `k`, `M`, `G`, and `T`.
This is only an approximate upper bound, the actual memory consumption might be
higher. When too low, `qlever index` might fail with an error message (which usually
makes it clear that you need to increase this value). The strange name of the
variable / option is an artifact from when QLever used the [STXXL
library](http://stxxl.org/) for external memory sorting, which it
no longer does. The name will be changed soon. Defaut: `1G`.

`PARSER_BUFFER_SIZE`, `--parser-buffer-size`: The size of the buffer used by
`qlever index` when parsing an input stream, specified with standard suffixes
like `k`, `M`, `G`, and `T`. This must be large enough to hold the longest
predicate-object list in your dataset (everything from a subject until the next
`.`). Predicate-object lists are usually short, but can be long for `TTL`
datasets with many long literals, see [Qleverfile.osm-planet](https://github.com/qlever-dev/qlever-control/tree/main/src/qlever/Qleverfiles/Qleverfile.osm-planet). Default: `10M`.

`VOCABULARY_TYPE`, `--vocabulary-type`: Whether the vocabulary is stored
compressed or not (trade-off between index size and query speed), whether to
store it on disk or in memory (trade-off between memory consumption and query
speed), and whether to store geometry data in a separate file (always a good
idea if your dataset contains geometry data). The options are
`on-disk-compressed`, `in-memory-compressed`, `on-disk-uncompressed`,
`in-memory-uncompressed`, and `on-disk-compressed-geo-split`. Default:
`on-disk-compressed`.

`ENCODE_AS_IDS`, `--encode-as-ids`: List of IRI prefixes (separated by spaces)
with the effect that all IRIs starting with one of these prefixes and followed
by a sequence of at most 12 digits will not be stored as strings in the
vocabulary, but stored directly in one of QLever's internal 64-bit identifiers.
See
[Qleverfile.osm-planet](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.osm-planet) for an example. Default: none.

`TEXT_INDEX`, `--text-index`: Four options: `none` (no text index),
`from_literals` (create a text index from all literals in the dataset),
`from_text_records` (create a text index from the givens "words" and "docs"
file, see `TEXT_WORDS_FILE` and `TEXT_DOCS_FILE` below), and
`from_literals_and_text_records` (create a text index from both literals and
the given "words" and "docs" file). Default: `none`.

`TEXT_WORDS_FILE`, `--text-words-file`: The name of the file containing the
word occurrences for the text index, one line per occurrence with four
tab-separated columns each, in the format `word or <IRI> TAB 0 or 1 TAB text record
id TAB always 1`. Default: `<NAME>.wordsfile.tsv`.

`TEXT_DOCS_FILE`, `--text-docs-file`: The name of the file containing the text
records for the text index, one line per record with two tab-separated columns
each, in the format `text record id TAB text`. Default: `<NAME>.docsfile.tsv`.

`ADD_HAS_WORD_TRIPLES`, `--add-has-word-triples`: Whether to additionally store,
for each triple with a literal object and for each word in that literal, an
internal triple of the form `<literal> ql:has-word "word"`. The (named) graph
of these internal triples is used to store the term frequency of the word in
the literal. The triples can be used to implement custom full-text search
queries, in particular in combination with [materialized
views](materialized-views.md). Default: `false`.

`INDEX_BINARY`, `--index-binary`: The binary for building the index, when
using `SYSTEM = native`. The binary must either be in your `PATH` or you must
specify the full path. Default: `qlever-index` (which is the default name
of the binary for index building when compiling QLever).

`MATERIALIZED_VIEWS`, `--materialized-views`: Materialized views to be written at indexing time, given as a JSON object. The keys in the JSON are used as view names and the string values as the SPARQL queries for writing the respective view. By default, no materialized views are written.

## Section `[server]`

`HOST_NAME`, `--host-name`: The host name used by the `qlever` CLI to reach
the server, for example in `qlever start`, `qlever query`, and `qlever ui`. For
`qlever ui`, this is also the SPARQL endpoint to which the UI sends its
queries. If DNS resolves the host name to an address that is not reachable,
`qlever start` can take very long, see
[Troubleshooting](troubleshooting.md#qlever-start-takes-a-long-time-although-the-server-is-ready).
Default: the host name of the machine.

`PORT`, `--port`: The port of the SPARQL endpoint created by `qlever start`.
Default: none.

`ACCESS_TOKEN`, `--access-token`: The access token required for privileged
operations such as `qlever clear-cache --complete`, `qlever query
--pin-to-cache`, and `qlever settings` (when modifying a setting). Default:
none (in which case no privileged operations are possible at all).

`MEMORY_FOR_QUERIES`, `--memory-for-queries`: The amount of memory that can be
used for queries, specified with standard suffixes like `k`, `M`, `G`, and `T`.
Default: `5G`.

`TIMEOUT`, `--timeout`: The maximum time a query is allowed to run, specified
with standard suffixes like `s`, `m`, and `h`. This is an approximate upper
bound, queries might run longer in some cases. Default: `30s`.

`CACHE_MAX_SIZE`, `--cache-max-size`: The maximum size of the cache used for
caching query results, specified with standard suffixes like `k`, `M`,
`G`, and `T`. When the total size of the cached results exceeds this value, the
eviction strategy is Least Recently Used (LRU). Default: `2G`.

`CACHE_MAX_SIZE_SINGLE_ENTRY`, `--cache-max-size-single-entry`: The maximum
size of a single cache entry, specified with standard suffixes like `k`, `M`,
`G`, and `T`. Default: `1G`.

`CACHE_MAX_NUM_ENTRIES`, `--cache-max-num-entries`: The maximum number of
cached results held in the cache at the same time. When the number of cached
results exceeds this value, the eviction strategy is Least Recently Used (LRU).
Default: `200`.

`PERSIST_UPDATES`, `--persist-updates`: When `true` (or the command-line
option `--persist-updates` is given), all update requests processed after
`qlever start` are persisted to disk, in a single file `<NAME>.update-triples`.
When the server is stopped and `qlever start` is run again, the updates are
replayed and new updates are appended to the same file. This is rudimentary
for now, a more sophisticated mechanism is currently being developed. For an
alternative, see `qlever update-wikidata`, where updates come from an SSE
stream, and can be replayed any time from an arbitrary point in time, and the
date until which the dataset is up to date is stored in dedicated triples.
Default: `false`.

`PRELOAD_MATERIALIZED_VIEWS`, `--preload-materialized-views`: Materialized views to be loaded upon server start. Takes an arbitrary number of arguments. By default, no views are loaded on server start.

## Section `[runtime]`

`SYSTEM`, `--system`: Three options: `native` (run natively, assuming that the
QLever binaries `qlever-server` and `qlever-index` are in your `PATH`),
`docker` (pull `Docker` image if none is present locally, and run in a
`Docker` container), and `podman` (same as `docker`, but using `Podman`
instead of `Docker`). Default: `docker`.

`IMAGE`, `--image`: The name of the image when using `SYSTEM = docker` or
`SYSTEM = podman`. Default: `docker.io/adfreiburg/qlever:latest`.

`INDEX_CONTAINER`, `--index-container`: The name of the container used by
`qlever index`, when using `SYSTEM = docker` or `SYSTEM = podman`.

`SERVER_CONTAINER`, `--server-container`: The name of the container used by
`qlever start`, when using `SYSTEM = docker` or `SYSTEM = podman`.

## Section `[ui]`

`UI_CONFIG`, `--ui-config`: The name of one of the preconfigurations from
<https://qlever.dev> (the slug after the <https://qlever.dev/> is the name of the
preconfiguration). You cannot choose your own name here yet; this will be fixed
soon. But once you have picked a preconfiguration, you can modify it
arbitrarily (except for the name) after running `qlever ui` once, see the
instructions printed by `qlever ui`. Default: `default`.

`UI_PORT`, `--ui-port`: The port of the Qlever UI started with `qlever ui`.
The URL at which the UI can be accessed is printed by `qlever ui`. Default:
`8176` (the ASCII codes for `Q` and `L`).

`UI_SYSTEM`, `--ui-system`: Which container system to use for `qlever ui`,
either `docker` or `podman`. Note that unlike for `qlever index` and `qlever
start`, there is no `native` option (the only reason for a `native` mode there
is that it is more efficient, but that is not a concern for the UI). Default:
`docker`.

`UI_IMAGE`, `--ui-image`: The name of the image used for `qlever ui`. Default:
`docker.io/adfreiburg/qlever-ui`.

`UI_CONTAINER`, `--ui-container`: The name of the container used for `qlever
ui`, when using `UI_SYSTEM = docker` or `UI_SYSTEM = podman`. Default:
`qlever.ui.<NAME>`.

## `SETTINGS_JSON` keys

The following keys are recognized in the JSON object given to `SETTINGS_JSON`
in the `[index]` section. As mentioned there, `SETTINGS_JSON` exists for
historical reasons and will be deprecated soon, with the individual keys
migrated to their own `Qleverfile` variables. The keys are listed in roughly
decreasing order of relevance.

`"num-triples-per-batch"`: How many triples are processed in one batch during
`qlever index`. All data from a batch is kept in memory until it has been
fully processed, and when parsing input streams in parallel, multiple batches
are kept in memory at the same time. Thus, choosing a large value can lead to
high memory consumption or an out-of-memory crash. On the other hand, two
files per batch are produced during `qlever index`, so a small value can
require increasing your `ULIMIT`. Default: `10000000` (ten million).

`"parser-batch-size"`: The number of triples the parser hands off to the index
builder in one batch through the parallel parsing pipeline, controlling the
granularity of that pipeline. This is a triple count, not a memory size, and
is unrelated to `PARSER_BUFFER_SIZE` (the byte size of the parser's I/O
buffer) and to `"num-triples-per-batch"` (which controls the size of partial
vocabularies). Usually there is no reason to change it. Default: `1000000`
(one million).

`"parser-integer-overflow-behavior"`: How the TTL parser handles integer
literals that do not fit into a 64-bit integer. One of
`overflowing-integers-throw` (abort `qlever index` with an error message
identifying the offending literal), `overflowing-integers-become-doubles`
(silently convert only the overflowing values to doubles), and
`all-integers-become-doubles` (convert every integer literal to a double,
regardless of its size). Note that any conversion to a double can lose
precision, so silently converting overflowing integers may make subsequent
queries return slightly different numeric results than expected. Default:
`overflowing-integers-throw`.

`"ascii-prefixes-only"`: If `true`, the TTL parser assumes that all prefix
declarations contain only ASCII characters, which is faster to parse but
rejects datasets that use non-ASCII characters in their prefix declarations.
Default: `false`. This is deprecated; there is no longer a noticeable
performance difference.

`"locale"`: A JSON object with the keys `"language"`, `"country"`, and
`"ignore-punctuation"` that determines the locale used by QLever for
collation, which in turn influences the sort order of strings and the result
of string comparisons in SPARQL queries. Note that changing the locale
requires a complete rebuild of the index, and that any non-default value is
currently untested by the QLever team, so be prepared to file bug reports.
Default: `{"language": "en", "country": "US", "ignore-punctuation": false}`.

`"prefixes-external"`: A list of IRI prefixes with the effect that all IRIs
and literals starting with one of these prefixes are stored in the external
(on-disk) part of the vocabulary instead of the internal (in-memory) part. To
keep certain IRIs in memory for faster lookup, specify a more restrictive
list. Default: `[""]`, that is, a list with the single empty string, which
matches every IRI and every literal, so the entire vocabulary is external.

`"languages-internal"`: A list of language tags with the effect that all
language-tagged literals carrying one of these tags are stored in the
internal (in-memory) part of the vocabulary instead of the external (on-disk)
part. Use this for languages whose literals occur often in query results, to
make those queries faster. Default: none.

`"ignore-case"`: Removed. `qlever index` aborts with an error if this key is
present. QLever no longer supports building a case-insensitive index. If
needed, case-insensitive matching has to be done at query time (e.g. via
`FILTER (LCASE(?x) = "...")` or `FILTER REGEX(?x, "...", "i")`).

## Runtime parameters

Runtime parameters control many aspects of the QLever server, like timeouts,
the cache, and the query planning. Unlike the variables above, they can also be
changed while the server is running. They can be set in the `[server]` section
of the `Qleverfile` via `SET_RUNTIME_PARAMETERS`, or in one of the following
ways.

=== "qlever CLI"
    ```bash
    # While the server is running (requires the access token):
    qlever settings default-query-timeout=60s
    # Show the current values of all runtime parameters:
    qlever settings
    # When starting the server:
    qlever start --set-runtime-parameters default-query-timeout=60s log-level=DEBUG
    ```
=== "Qleverfile"
    The runtime parameters in the `[server]` section of your `Qleverfile` are
    set when executing `qlever start`.

    ```ini
    [server]
    SET_RUNTIME_PARAMETERS = default-query-timeout=60s log-level=DEBUG
    ```
=== "qlever-server"
    ```bash
    qlever-server [...] --set-runtime-parameter default-query-timeout=60s --set-runtime-parameter log-level=DEBUG
    # List all runtime parameters with their default values:
    qlever-server --set-runtime-parameter help
    ```
=== "curl"
    ``` bash
    # Set a runtime parameter:
    curl "http://$HOST:$PORT/" --data-urlencode "default-query-timeout=60s" --data-urlencode "access-token=$ACCESS_TOKEN"
    # Get the current values of all runtime parameters:
    curl "http://$HOST:$PORT/" --data-urlencode "cmd=get-settings"
    ```

Some runtime parameters can also be set by a dedicated option of
`qlever-server` or a dedicated variable of the `Qleverfile`, for example
`CACHE_MAX_SIZE`. Note that `qlever start` passes its own defaults for these,
which may differ from the defaults of `qlever-server` listed below.

Memory sizes are given with units, like `4G` or `500M`, durations with units,
like `30s` or `50ms`, and booleans as `true` or `false`.

`cache-max-num-entries`: The maximum number of cache entries. If exceeded, the
least recently used entries that are not pinned are removed. Default: `1000`.
Also set by `CACHE_MAX_NUM_ENTRIES` (see [above](#section-server)), so with
`qlever start`, the default is `200`.

`cache-max-size`: The maximum total size of all cache entries (pinned and not
pinned). The cache counts toward the memory available for queries. Default:
`30G`. Also set by `CACHE_MAX_SIZE` (see [above](#section-server)), so with
`qlever start`, the default is `2G`.

`cache-max-size-lazy-result`: The maximum size up to which results that are
computed lazily (in chunks) are cached, because caching them causes
significant overhead. Default: `5M`.

`cache-max-size-single-entry`: The maximum size of a single cache entry.
Larger results are not cached, unless they are pinned. Default: `5G`. Also
set by `CACHE_MAX_SIZE_SINGLE_ENTRY` (see [above](#section-server)), so with
`qlever start`, the default is `1G`.

`cache-service-results`: If `true`, the results of `SERVICE` requests are
cached. By default, they are not, because a remote endpoint may change at any
time. If you control the endpoints, you can enable it, but then QLever no
longer passes the results of the other parts of the query to the remote
endpoint as `VALUES`. Default: `false`.

`construct-deduplication`: How duplicate triples in the result of `CONSTRUCT`
queries are handled: `none` (every triple is emitted), `full` (every triple is
emitted at most once), or `lru:N` with a positive integer `N` (a triple is not
emitted again if it is among the `N` most recently emitted distinct triples;
this needs bounded memory, but removes only some duplicates). Default: `none`.

`default-query-timeout`: The time after which a query is cancelled, unless a
different timeout is requested for the query. Default: `30s`. Also set by
`TIMEOUT` (see [above](#section-server)).

`disable-caching`: If `true`, all queries started afterwards neither read from
nor write to the cache. This avoids the overhead of caching when it is not
needed, and is useful for debugging. Default: `false`.

`division-by-zero-is-undef`: If `true`, a division by zero yields an unbound
value. If `false`, it yields `NaN` or infinity. Default: `true`.

`enable-distributive-union`: If `true`, a join with a `UNION` may be pushed into
both of its children, if this is estimated to be cheaper. Default: `true`.

`enable-materialized-view-query-rewrite`: If `true`, the query planner
automatically uses loaded [materialized views](materialized-views.md) for suitable parts of queries.
Default: `true`.

`enable-prefilter-on-index-scans`: If `true`, `FILTER` expressions are also used
to skip blocks of the index scans of their variables. Setting this to `false`
is mainly useful for debugging. Default: `true`.

`group-by-disable-index-scan-optimizations`: If `true`, the special
optimizations for a `GROUP BY` directly on an index scan are disabled.
Default: `false`.

`group-by-hash-map-enabled`: If `true`, `GROUP BY` may use a hash map instead
of sorting its input. Default: `false`.

`lazy-index-scan-max-size-materialization`: For a join, the result of a child
whose estimated size is below this number of rows is computed completely
upfront instead of lazily. Default: `1000000`.

`lazy-index-scan-num-blocks-in-flight`: The number of blocks that an index scan
reads and decompresses ahead of the operation that uses them. Smaller values
can slow down queries with joins on large relations. Must be at least `1`.
Default: `20`.

`log-level`: The log level of the server, one of `FATAL`, `ERROR`, `WARN`,
`INFO`, `DEBUG`, `TIMING`, and `TRACE`. Messages that are less important than
this level are not logged. The log level that the server binary was compiled
with is an upper bound. Default: `INFO` (or the compile-time log level, if it is
less verbose).

`materialized-view-pattern-match-num-assignments`: The maximum number of
candidate variable assignments tried when matching the patterns of materialized
views against a query, across all views. `0` disables pattern-based matching.
Default: `100000`.

`materialized-view-pattern-match-num-replacement-plans`: The maximum number of
matches (and thus alternative query plans using a view) collected for a query.
Default: `500`.

`materialized-view-writer-memory`: The memory available for sorting the rows of
a materialized view while writing it. Default: `4G`.

`max-num-threads-per-query`: The maximum number of tasks that a single query
runs at the same time on the global thread pool of the server (for example,
for reading and decompressing the blocks of its index scans). This keeps a
single expensive query from occupying all threads. Must be at least `1`.
Default: `6`.

`pattern-trick-num-tasks-in-flight`: How many tasks of the counting loops for
queries like `SELECT ?p (COUNT(?s) AS ?count) { ?s ?p ?o } GROUP BY ?p` run at
the same time (still bounded by `max-num-threads-per-query`). `0` means the
number of logical cores. Default: `3`.

`permutation-writer-num-blocks-in-flight`: The maximum number of blocks per
permutation that are queued for or being compressed and written, during a
rebuild or when writing a materialized view. Each of them is held in memory
until it is written. Must be at least `1`. Default: `4`.

`prefiltered-optional-join`: If `true`, an `OPTIONAL` whose right side is an
index scan only reads the blocks of the index scan that can match the left side.
Default: `true`.

`query-planning-budget`: QLever finds the best query plan for a group of the
query by dynamic programming over all connected subsets of its triples and
filters. If the number of these subsets exceeds this budget, QLever uses a
faster greedy query planning instead. Default: `1500`.

`rebuild-index-scan-num-threads`: The maximum number of threads with which each
scan of a permutation during a rebuild reads and decompresses its blocks. `0`
means no limit. Default: `1` (which leaves CPU to concurrent queries at almost
no cost in rebuild time).

`rebuild-max-concurrent-permutation-pairs`: The maximum number of permutation
pairs (like PSO and POS) that are rebuilt in parallel during a [rebuild of the index](rebuild-index.md). Each pair needs several
CPU cores and a lot of memory bandwidth, so this is the most important
parameter for reducing the impact of a rebuild on concurrent queries. `0` means
no limit. Default: `0`.

`rebuild-permutation-writer-num-threads`: The maximum number of threads with
which each permutation is compressed and written during a rebuild. `0` means no
limit. Default: `1`.

`request-body-limit`: The maximum size of the body of requests that the server
processes. `0` disables the limit. Default: `1G`.

`service-allowed-iri-prefixes`: A space-separated list of IRI prefixes that are
allowed as `SERVICE` endpoints. If empty, all endpoints are allowed. Otherwise,
`SERVICE` requests to endpoints that do not start with one of the prefixes are
rejected. To disable all federated queries, set this to an invalid prefix like
`-`. QLever's own special services (like spatial search or materialized views)
are never affected. We recommend restricting this on public endpoints, for
example via `qlever settings service-allowed-iri-prefixes="https://qlever.dev/api/wikidata https://query.wikidata.org/sparql"`.
Default: empty (all endpoints are allowed).

`service-max-redirects`: The maximum number of HTTP redirects followed for a
`SERVICE` request. Default: `1`.

`service-max-value-rows`: The maximum number of rows of the other parts of the
query that QLever passes to a remote endpoint as `VALUES`, to restrict the
result of the `SERVICE` request. Default: `10000`.

`small-index-scan-size-estimate-divisor`: If the result of an index scan is
smaller than a single block, its size is estimated as the size of the block
divided by this value. Default: `5`.

`sort-estimate-cancellation-factor`: If the estimated time of a sort exceeds the
remaining time of the query by more than this factor, the query is cancelled
right away instead of when the timeout is reached. Default: `3.0`.

`sort-in-memory-threshold`: Sorting an intermediate result larger than this
uses external sorting instead of sorting in memory. Default: `5G`.

`sort-num-tasks-in-flight`: How many tasks of an in-memory sort run at the same
time (still bounded by `max-num-threads-per-query`). `1` means that sorting is
sequential. Default: `3`.

`sparql-results-json-with-time`: If `true`, each result in the
`application/sparql-results+json` format contains a top-level `meta` field with
the query time and result size. Default: `true`.

`spatial-join-max-num-threads`: The maximum number of threads used by a [spatial
search](geosparql.md) (also for GeoSPARQL `FILTER`s that are evaluated as a spatial search).
`0` means the number of CPU threads. Default: `8`.

`spatial-join-prefilter-max-size`: With [geometry
preprocessing](geosparql.md#geometry-preprocessing), the inputs of the larger
side of a spatial search are prefiltered using the aggregated bounding box of
the smaller side. If this bounding box is very large, the cost of prefiltering
can outweigh its savings. Therefore, prefiltering is only used up to this size
of the bounding box (in square coordinates). `0` disables prefiltering.
Default: `2500`.

`spatial-join-tmp-dir`: The directory in which the `libspatialjoin` algorithm
writes its temporary files. If empty, the index directory is used. Default:
empty.

`strip-columns`: If `true`, columns that are not needed any more are removed
from intermediate results. This can make queries faster, but leads to more cache
misses between otherwise equal queries. Default: `false`.

`syntax-test-mode`: If `true`, several queries that are syntactically valid but
otherwise erroneous (for example, `LOAD` or `SERVICE` requests to nonexisting
endpoints) return an empty result instead of an error. Only use this for
running the syntax tests of the W3C SPARQL 1.1 test suite. Default: `false`.

`throw-on-invalid-wkt`: If `true`, an invalid WKT literal given in the query
(directly or via `VALUES`) as an argument of a GeoSPARQL function makes the
query fail with an error. If `false`, the function yields an unbound value, as
specified by GeoSPARQL 1.1. Default: `false`.

`throw-on-unbound-variables`: If `true`, queries that use variables in `GROUP
BY`, `BIND`, or `ORDER BY` that are not bound anywhere in the query fail with
an error. Such queries are allowed by the SPARQL standard, but are usually the
result of a typo. Default: `false`.

`treat-default-graph-as-named-graph`: If `true`, a query like `SELECT * { GRAPH
?g { ?s ?p ?o } }` also returns the triples from the default graph. If `false`,
they are filtered out, as specified by the SPARQL standard. Default: `false`.

`use-binsearch-transitive-path`: If `true`, property paths with `*` and `+` are
computed with binary search on the sorted input instead of a hash map.
Default: `true`.

`vacuum-minimum-block-size`: Only blocks of at least this size are considered
when vacuuming the [updates](update.md). Default: `100`.

`websocket-updates-enabled`: If `true`, clients like the QLever UI receive live
updates of the runtime information of a query via a WebSocket while it is
running. Default: `true`.

`zero-cost-estimate-for-cached-subtree`: If `true`, the query planner estimates
the cost of a part of the query whose result is cached as zero. Default:
`false`.
