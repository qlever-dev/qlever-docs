# Runtime parameters

Runtime parameters control many aspects of the QLever server, like timeouts,
the cache, and the query planning. Unlike the options of `qlever-server`, they
can also be changed while the server is running.

## Setting runtime parameters

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

    See also: [Qleverfile reference](qleverfile.md#section-server)
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

## Query processing

`default-query-timeout`: The time after which a query is cancelled, unless a
different timeout is requested for the query. Default: `30s`.

`max-num-threads-per-query`: The maximum number of tasks that a single query
runs at the same time on the global thread pool of the server (for example,
for reading and decompressing the blocks of its index scans). This keeps a
single expensive query from occupying all threads. Must be at least `1`.
Default: `6`.

`request-body-limit`: The maximum size of the body of requests that the server
processes. `0` disables the limit. Default: `1G`.

`throw-on-unbound-variables`: If `true`, queries that use variables in `GROUP
BY`, `BIND`, or `ORDER BY` that are not bound anywhere in the query fail with
an error. Such queries are allowed by the SPARQL standard, but are usually the
result of a typo. Default: `false`.

`division-by-zero-is-undef`: If `true`, a division by zero yields an unbound
value. If `false`, it yields `NaN` or infinity. Default: `true`.

`construct-deduplication`: How duplicate triples in the result of `CONSTRUCT`
queries are handled: `none` (every triple is emitted), `full` (every triple is
emitted at most once), or `lru:N` with a positive integer `N` (a triple is not
emitted again if it is among the `N` most recently emitted distinct triples;
this needs bounded memory, but removes only some duplicates). Default: `none`.

`treat-default-graph-as-named-graph`: If `true`, a query like `SELECT * { GRAPH
?g { ?s ?p ?o } }` also returns the triples from the default graph. If `false`,
they are filtered out, as specified by the SPARQL standard. Default: `false`.

`sparql-results-json-with-time`: If `true`, each result in the
`application/sparql-results+json` format contains a top-level `meta` field with
the query time and result size. Default: `true`.

`syntax-test-mode`: If `true`, several queries that are syntactically valid but
otherwise erroneous (for example, `LOAD` or `SERVICE` requests to nonexisting
endpoints) return an empty result instead of an error. Only use this for
running the syntax tests of the W3C SPARQL 1.1 test suite. Default: `false`.

## Cache

QLever caches the results of queries and their subqueries.

`cache-max-size`: The maximum total size of all cache entries (pinned and not
pinned). The cache counts toward the memory available for queries. Default:
`30G`.

`cache-max-size-single-entry`: The maximum size of a single cache entry.
Larger results are not cached, unless they are pinned. Default: `5G`.

`cache-max-num-entries`: The maximum number of cache entries. If exceeded, the
least recently used entries that are not pinned are removed. Default: `1000`.

`cache-max-size-lazy-result`: The maximum size up to which results that are
computed lazily (in chunks) are cached, because caching them causes
significant overhead. Default: `5M`.

`disable-caching`: If `true`, all queries started afterwards neither read from
nor write to the cache. This avoids the overhead of caching when it is not
needed, and is useful for debugging. Default: `false`.

## Federated queries (`SERVICE`)

`service-allowed-iri-prefixes`: A space-separated list of IRI prefixes that are
allowed as `SERVICE` endpoints. If empty, all endpoints are allowed. Otherwise,
`SERVICE` requests to endpoints that do not start with one of the prefixes are
rejected. To disable all federated queries, set this to an invalid prefix like
`-`. QLever's own special services (like spatial search or materialized views)
are never affected. We recommend restricting this on public endpoints, for
example via `qlever settings service-allowed-iri-prefixes="https://qlever.dev/api/wikidata https://query.wikidata.org/sparql"`.
Default: empty (all endpoints are allowed).

`cache-service-results`: If `true`, the results of `SERVICE` requests are
cached. By default, they are not, because a remote endpoint may change at any
time. If you control the endpoints, you can enable it, but then QLever no
longer passes the results of the other parts of the query to the remote
endpoint as `VALUES`. Default: `false`.

`service-max-value-rows`: The maximum number of rows of the other parts of the
query that QLever passes to a remote endpoint as `VALUES`, to restrict the
result of the `SERVICE` request. Default: `10000`.

`service-max-redirects`: The maximum number of HTTP redirects followed for a
`SERVICE` request. Default: `1`.

## Materialized views

See [Materialized views](materialized-views.md) for details.

`materialized-view-writer-memory`: The memory available for sorting the rows of
a materialized view while writing it. Default: `4G`.

`enable-materialized-view-query-rewrite`: If `true`, the query planner
automatically uses loaded materialized views for suitable parts of queries.
Default: `true`.

`materialized-view-pattern-match-num-assignments`: The maximum number of
candidate variable assignments tried when matching the patterns of materialized
views against a query, across all views. `0` disables pattern-based matching.
Default: `100000`.

`materialized-view-pattern-match-num-replacement-plans`: The maximum number of
matches (and thus alternative query plans using a view) collected for a query.
Default: `500`.

## GeoSPARQL and spatial search

See [GeoSPARQL support](geosparql.md) for details.

`spatial-join-max-num-threads`: The maximum number of threads used by a spatial
search (also for GeoSPARQL `FILTER`s that are evaluated as a spatial search).
`0` means the number of CPU threads. Default: `8`.

`spatial-join-prefilter-max-size`: With geometry preprocessing, the inputs of
the larger side of a spatial search are prefiltered using the aggregated
bounding box of the smaller side. This is the maximum size of that bounding
box (in square coordinates) for which prefiltering is used. `0` disables
prefiltering. Default: `2500`.

`spatial-join-tmp-dir`: The directory in which the `libspatialjoin` algorithm
writes its temporary files. If empty, the index directory is used. Default:
empty.

`throw-on-invalid-wkt`: If `true`, an invalid WKT literal given in the query
(directly or via `VALUES`) as an argument of a GeoSPARQL function makes the
query fail with an error. If `false`, the function yields an unbound value, as
specified by GeoSPARQL 1.1. Default: `false`.

## Index rebuild and updates

These parameters affect the [rebuild of the index](rebuild-index.md) while the
server is running. They allow trading the duration of the rebuild against its
impact on concurrent queries.

`rebuild-max-concurrent-permutation-pairs`: The maximum number of permutation
pairs (like PSO and POS) that are rebuilt in parallel. Each pair needs several
CPU cores and a lot of memory bandwidth, so this is the most important
parameter for reducing the impact of a rebuild on concurrent queries. `0` means
no limit. Default: `0`.

`rebuild-index-scan-num-threads`: The maximum number of threads with which each
scan of a permutation during a rebuild reads and decompresses its blocks. `0`
means no limit. Default: `1` (which leaves CPU to concurrent queries at almost
no cost in rebuild time).

`rebuild-permutation-writer-num-threads`: The maximum number of threads with
which each permutation is compressed and written during a rebuild. `0` means no
limit. Default: `1`.

`permutation-writer-num-blocks-in-flight`: The maximum number of blocks per
permutation that are queued for or being compressed and written, during a
rebuild or when writing a materialized view. Each of them is held in memory
until it is written. Must be at least `1`. Default: `4`.

`vacuum-minimum-block-size`: Only blocks of at least this size are considered
when vacuuming the [updates](update.md). Default: `100`.

## Query planning

`query-planning-budget`: QLever finds the best query plan for a group of the
query by dynamic programming over all connected subsets of its triples and
filters. If the number of these subsets exceeds this budget, QLever uses a
faster greedy query planning instead. Default: `1500`.

`enable-distributive-union`: If `true`, a join with a `UNION` may be pushed into
both of its children, if this is estimated to be cheaper. Default: `true`.

`enable-prefilter-on-index-scans`: If `true`, `FILTER` expressions are also used
to skip blocks of the index scans of their variables. Setting this to `false`
is mainly useful for debugging. Default: `true`.

`prefiltered-optional-join`: If `true`, an `OPTIONAL` whose right side is an
index scan only reads the blocks of the index scan that can match the left side.
Default: `true`.

`strip-columns`: If `true`, columns that are not needed any more are removed
from intermediate results. This can make queries faster, but leads to more cache
misses between otherwise equal queries. Default: `false`.

`zero-cost-estimate-for-cached-subtree`: If `true`, the query planner estimates
the cost of a part of the query whose result is cached as zero. Default:
`false`.

`small-index-scan-size-estimate-divisor`: If the result of an index scan is
smaller than a single block, its size is estimated as the size of the block
divided by this value. Default: `5`.

`lazy-index-scan-max-size-materialization`: For a join, the result of a child
whose estimated size is below this number of rows is computed completely
upfront instead of lazily. Default: `1000000`.

`group-by-hash-map-enabled`: If `true`, `GROUP BY` may use a hash map instead
of sorting its input. Default: `false`.

`group-by-disable-index-scan-optimizations`: If `true`, the special
optimizations for a `GROUP BY` directly on an index scan are disabled.
Default: `false`.

`use-binsearch-transitive-path`: If `true`, property paths with `*` and `+` are
computed with binary search on the sorted input instead of a hash map.
Default: `true`.

## Performance tuning

`lazy-index-scan-num-blocks-in-flight`: The number of blocks that an index scan
reads and decompresses ahead of the operation that uses them. Smaller values
can slow down queries with joins on large relations. Must be at least `1`.
Default: `20`.

`sort-in-memory-threshold`: Sorting an intermediate result larger than this
uses external sorting instead of sorting in memory. Default: `5G`.

`sort-num-tasks-in-flight`: How many tasks of an in-memory sort run at the same
time (still bounded by `max-num-threads-per-query`). `1` means that sorting is
sequential. Default: `3`.

`sort-estimate-cancellation-factor`: If the estimated time of a sort exceeds the
remaining time of the query by more than this factor, the query is cancelled
right away instead of when the timeout is reached. Default: `3.0`.

`pattern-trick-num-tasks-in-flight`: How many tasks of the counting loops for
queries like `SELECT ?p (COUNT(?s) AS ?count) { ?s ?p ?o } GROUP BY ?p` run at
the same time (still bounded by `max-num-threads-per-query`). `0` means the
number of logical cores. Default: `3`.

## Logging and live updates

`log-level`: The log level of the server, one of `FATAL`, `ERROR`, `WARN`,
`INFO`, `DEBUG`, `TIMING`, and `TRACE`. Messages that are less important than
this level are not logged. The log level that the server binary was compiled
with is an upper bound. Default: `INFO` (or the compile-time log level, if it is
less verbose).

`websocket-updates-enabled`: If `true`, clients like the QLever UI receive live
updates of the runtime information of a query via a WebSocket while it is
running. Default: `true`.
