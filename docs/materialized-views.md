# Materialized Views (beta)

QLever implements materialized views, currently as an independent extension to SPARQL. Materialized views can be regarded as bridging the gap between relational databases and RDF by combining the best of both worlds. Materialized views allow precomputing and indexing query result tables, including but not limited to table-like structures (join stars) present in the data. The index will be built on the first column (sorting first - second - third column), which in many cases has (but doesn't need to have) the role of a primary key. These precomputations can be used as part of subsequent queries. Instead of computing expensive join operations or function calls, QLever just scans the materialized view at query time. Depending on the query, this may speed up evaluation by orders of magnitude.


*NOTE: This feature is still in beta. It is stable but not fully featured yet. Please see the [shortcomings](#shortcomings) section below.*

## Features currently supported

- Writing materialized views from a large subset of possible SPARQL `SELECT` queries, either using an HTTP request or using `libqlever` for embedded use of QLever. For details, see [Writing](#writing).
    - Query results used for writing the view do not need to fit into memory, as lazy evaluation and external sorting is supported.
- Preloading materialized views using an HTTP request or using `libqlever`. For details, see [Preloading](#preloading).
- Querying materialized views in SPARQL using a special predicate (for only a single column) or a special `SERVICE` query. For details, see [Querying](#querying).
    - Materialized views allow full scans (which support automatic prefiltering for efficient joins), filtering by fixed values on the first, first and second or first, second and third column.

## Shortcomings

- The query to build a view currently must be a `SELECT` query, needs to select a minimum of four columns and may not require local vocabulary entries (that is, literals not present in the index except for integers, floating points, booleans, dates, WKT `POINT` literals or encoded numeric IRIs)
- Materialized views are not detected automatically in query planning to accelerate conventional queries but rather need to be requested manually. For details, see [Querying](#querying).
- Materialized views can be preloaded one-by-one or are loaded automatically upon first use. In the future the configuration will allow loading a list or all at server start.
- SPARQL Updates after creation of a view are ignored and queries for writing may not contain values from updates.
- Reading from a materialized view always reads the first three columns even if they are not requested - the unused ones are discarded immediately.

## Writing

You may write a materialized view using an HTTP request or `libqlever` as shown below. Simply subsitute the placeholders as needed. If needed, the memory available for sorting the rows of the materialized view can be configured using the `materialized-view-writer-memory` runtime parameter, for example `qlever settings materialized-view-writer-memory=4G`.


=== "curl"
    ``` bash
    curl "http://$HOST:$PORT/?cmd=write-materialized-view&view-name=$VIEW_NAME&timeout=24h&access-token=$ACCESS_TOKEN" \
    -H "Accept: application/json" 
    -H "Content-type: application/sparql-query" 
    --data "SELECT ... { ... }"
    # Returns: {"materialized-view-written":"nameOfTheView"}
    ```
=== "libqlever"
    ```cpp
    qlever::EngineConfig config;
    config.baseName_ = "my-dataset";
    qlever::Qlever qlv{config};
    qlv.writeMaterializedView("nameOfTheView", "SELECT ... { ... }");
    ```

## Preloading

You may optionally preload materialized views. If you do not apply preloading, views get loaded automatically when they are used in a query for the first time. Preloading can be requested via HTTP and `libqlever`.


=== "curl"
    ``` bash
    curl "http://$HOST:$PORT/?cmd=load-materialized-view&view-name=$VIEW_NAME&access-token=$ACCESS_TOKEN"
    # Returns: {"materialized-view-loaded":"nameOfTheView"}
    ```
=== "libqlever"
    ```cpp
    qlever::EngineConfig config;
    config.baseName_ = "my-dataset";
    qlever::Qlever qlv{config};
    qlv.loadMaterializedView("nameOfTheView");
    ```

## Querying

Materialized views may be queried using the special predicate `view:VIEW-COLUMN` or using a special `SERVICE` query to `view:VIEW` (where `view:` is a prefix for `<https://qlever.cs.uni-freiburg.de/materializedView/>`, `VIEW` is the name of your materialized view and `COLUMN` is the name of the column you wish to read):

```sparql
PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
SERVICE view:VIEW {
  _:config view:column-COLUMN ?var ;
           view:column-... 
}
```

In case of the special predicate, the subject always refers to the first column of the view and may or may not be fixed to a literal. The object refers to the column indicated in the predicate.

When using the `SERVICE` syntax, the user may freely select an arbitrary subset of the columns persent in the materialized view.

??? note "Example queries on a materialized view"

    Assuming a materialized view `geometries` exists and its first column is `?osm_id` and it includes the columns `geometry` and `centroid`, you could issue each of the following queries:

    **1. special predicate with a fixed subject**

    ```sparql
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT * {
      osmway:6593464 view:geometries-geometry ?geo
    }
    ```

    **2. special predicate without a fixed subject (full scan)**

    ```sparql
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT * {
      ?x view:geometries-geometry ?geo ;
         osmkey:waterway [] .
    }
    ```

    **3. special `SERVICE` with full control over which columns are read**

    ```sparql
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT * WHERE {
      SERVICE view:geometries {
        _:config view:column-osm_id osmway:6593464 ;
                 view:column-geometry ?geo ;
                 view:column-centroid ?centroid .
      }
    }
    ```
