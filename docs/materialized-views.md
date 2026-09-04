# Materialized Views

!!! info "History"
    - Added in QLever 0.5.37

QLever allows storing the result of a SPARQL query as a so-called **materialized
view**, which can then be incorporated into subsequent queries. The
materialized view is stored compactly on disk using QLever's usual index
structures. This can speed up query processing significantly. In particular,
materialized views are useful for parts of (or derivations from) the data that are
inherently not just triples, but `n`-tuples with `n > 3`. In a relational
database, one would store such data in a table (which can have an arbitrary
number of columns), and with a materialized view, you can do just that in
QLever as well. This addresses a major shortcoming of RDF databases compared to
relational databases.

*NOTE: This feature is still in beta. It is stable but not fully featured yet.
Please see the section on [current limitations](#current-limitations) below.*

## Motivating example

The following example is based on the OpenStreetMap (OSM) dataset. Don't worry
if you are not familiar with this dataset; the example should still be easy to
understand.

The OSM dataset contains over ten billion geometries (think of points, lines,
and polygons representing points of interests, roads, lakes, etc.). Each
geometry has a number of properties: a WKT representation of the geometry, its
centroid, its bounding box, its area, its length, and so on. When modeling this
data in RDF, each property is represented as a separate set of triples. Let's
assume we want all these properties for a subset of the geometries, e.g., all
lakes. The natural SPARQL query for this looks as follows.

```sparql {data-demo-engine="osm-planet"}
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX unit: <http://qudt.org/vocab/unit/>
SELECT ?lake ?geometry ?centroid ?area ?length WHERE {
  ?lake osmkey:water "lake" .
  ?lake geo:hasGeometry/geo:asWKT ?geometry .
  BIND(geof:centroid(?geometry) AS ?centroid) .
  BIND(geof:area(?geometry, unit:M2) AS ?area) .
  BIND(geof:length(?geometry, unit:M) AS ?length) .
}
```

This is a very expensive query. It has to find the around one million lake
geometries among the over ten billion geometries. And it has to compute the
centroid, area, and length for each of these geometries. Imagine
instead that we have precomputed the result for the following SPARQL query,
which computes these attributes for **all** geometries in the dataset:

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX unit: <http://qudt.org/vocab/unit/>
SELECT ?subject ?intermediate ?geometry ?centroid ?area ?length WHERE {
  ?subject geo:hasGeometry ?intermediate .
  ?intermediate geo:asWKT ?geometry .
  BIND(geof:centroid(?geometry) AS ?centroid) .
  BIND(geof:area(?geometry, unit:M2) AS ?area) .
  BIND(geof:length(?geometry, unit:M) AS ?length) .
}
```

With a materialized view, you can store this result very compactly on disk, with
QLever's usual index structures, and then reformulate the original query to use
this materialized view instead. Each materialized view has a name; let us
assume this one is called `geometries`.

```sparql
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
SELECT ?lake ?geometry ?centroid ?area ?length WHERE {
  ?lake osmkey:water "lake" .
  SERVICE view:geometries { [
    view:column-subject ?lake ;
    view:column-geometry ?geometry ;
    view:column-centroid ?centroid ;
    view:column-area ?area ;
    view:column-length ?length
  ] }
}
```

## Writing a materialized view

You can write a materialized view using the `qlever` command-line interface
(this is the easiest way), via an HTTP request or via `libqlever`, as shown
below. Simply substitute the relevant placeholders as needed. If needed, the
memory available for sorting the rows of the materialized view can be
configured using the `materialized-view-writer-memory` runtime parameter, for
example `qlever settings materialized-view-writer-memory=4G`.


=== "qlever CLI"
    ```bash
    # During indexing if specified in Qleverfile:
    qlever index
    # After indexing while the server is running:
    qlever materialized-view $VIEW_NAME "SELECT ... { ... }"
    ```
=== "qlever-index"
    ```bash
    qlever-index [...] --materialized-views '{"view1": "SELECT ...", "view2": "SELECT ..."}'
    ```
=== "Qleverfile"
    In the `[index]` section of your `Qleverfile` you can state materialized views to be written when executing `qlever index`.

    ```ini
    [index]
    MATERIALIZED_VIEWS = {"view1": "SELECT ...", "view2": "SELECT ..."}
    ```

    See also: [Qleverfile reference](qleverfile.md#section-index)
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

## Preloading a materialized view

You can optionally preload materialized views. This is required for automatically rewriting queries to use materialized views (see [here](#automatic-usage-of-materialized-views) for details). If you do not apply preloading, views get loaded automatically when they are explicitly used in a query for the first time. Preloading can be requested via a CLI argument to `qlever-server`, an HTTP request and `libqlever`.

=== "qlever CLI"
    ```bash
    # At server start:
    qlever start --preload-materialized-views view1 view2 ...
    # When the server is already running:
    qlever materialized-view --load viewName
    ```
=== "qlever-server"
    ```bash
    qlever-server --preload-materialized-views view1 view2 ...
    # or
    qlever-server -l view1 view2 ...
    ```
=== "Qleverfile"
    In the `[server]` section of your `Qleverfile` you can state materialized views to be loaded when executing `qlever start`.

    ```ini
    [server]
    PRELOAD_MATERIALIZED_VIEWS = view1 view2 ... 
    ```

    See also: [Qleverfile reference](qleverfile.md#section-server)
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

## Querying a materialized view

Materialized views can be queried using the special predicate
`view:VIEW-COLUMN` or using a special `SERVICE` query to `view:VIEW` (where
`view:` is a prefix for
`<https://qlever.cs.uni-freiburg.de/materializedView/>`, `VIEW` is the name of
your materialized view and `COLUMN` is the name of the column you wish to
read):

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

    Assume the materialized view `geometries` from the motivating example above
    exists, with columns `subject`, `geometry`, `centroid`, `area`,
    and `length`.

    **1. Special predicate with a fixed subject (geometry of Germany)**

    ```sparql
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT ?geometry WHERE {
      osmrel:51477 view:geometries-geometry ?geometry .
    }
    ```

    **2. Special predicate without a fixed subject (all lakes and their
    geometries)**

    ```sparql
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT ?lake ?geometry WHERE {
      ?lake osmkey:water "lake" .
      ?lake view:geometries-geometry ?geometry . 
    }
    ```

    **3. Special `SERVICE` request reading multiple columns (all lakes and 
    their geometries and areas)**

    ```sparql
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX view: <https://qlever.cs.uni-freiburg.de/materializedView/>
    SELECT ?lake ?geometry ?area WHERE {
      ?lake osmkey:water "lake" .
      SERVICE view:geometries { [
        view:column-subject ?lake ;
        view:column-geometry ?geometry ;
        view:column-area ?area
      ] }
    }
    ```

## Automatic usage of materialized views

In addition to the [explicit query syntax](#querying-a-materialized-view), QLever can use materialized views in queries automatically. This is possible if an applicable view is loaded (see [Preloading a materialized view](#preloading-a-materialized-view)) and the query to write the view is contained in the user query. What this means is described in detail below.

**Join pattern matching**: Given a view written from a query containing only a basic graph pattern (short BGP, a set of triples with variables) of arbitrary shape, QLever can match the BGP to a given user query automatically. Additionally, more complex queries containing not only basic graph patterns are supported in some cases. In particular, `BIND` statements following the basic graph pattern are always allowed (see [here](#rewrite-bind) for details).

??? note "Restrictions when writing a view for automatic usage"

    When writing a materialized view that you would like to use automatically, please consider the following hints **for the query to write the materialized view**. A view not adhering to these restrictions may not be applicable for automatic usage. Note that the restrictions do *NOT* apply to the query that uses an already written view.

    1. Write a query with a single basic graph pattern, optionally followed by `BIND`
       statements. Do not use other syntax constructs like `OPTIONAL`, `UNION`, `SERVICE`, `GRAPH`, etc. For example, this view is suitable:

        ```sparql
        SELECT ?subject ?intermediate ?geometry ?centroid {
            ?subject geo:hasGeometry ?intermediate .
            ?intermediate geo:asWKT ?geometry .
            BIND(geof:centroid(?geometry) AS ?centroid) .
        }
        ```

    2. All triples in the basic graph pattern should be connected by variables (that is, the basic graph pattern should not require building a carthesian product).
    3. Do not use syntactic shortcuts, property paths or blank nodes. These should NOT appear in your view query:
        
        ```sparql
        ?s <p1>/<p2> ?o.
        # or
        ?s <p1> [ <p2> ?o ] .
        # or
        ?s ^<p1> ?o .
        # or
        ?s <p1> _:b . _:b <p2> ?o .
        ```

        The examples given here should be rewritten to ordinary triple patterns instead.

    4. Do not use predicate variables, like `<a> ?p ?o`.
    5. Select all variables appearing in your query.
    6. Do not use query modifiers like `DISTINCT`, `FROM`, `LIMIT`, `OFFSET`, `GROUP BY`, etc.

The join pattern matching works for almost all kinds of basic graph patterns independent of different variable naming in the user query, a different order of the triple patterns or where they appear in the user query (even inside subqueries or blocks like `OPTIONAL`, `UNION`, etc.). For example, the view `SELECT ?s ?o1 ?o2 { ?s <p1> ?o1 ; <p2> ?o2 }` is detected inside `SELECT * { ?a <p2> ?b . ?b <p3> ?c . ?a <p1> ?d }` or even `SELECT * { ?a <p3> ?b . OPTIONAL { ?a <p1> ?c . ?a <p2> ?d } }`.

Additionally, syntactic shortcuts can be used in the user query without hindering automatic rewrite, for example if your view is written as `SELECT ?s ?m ?o { ?s <p1> ?m . ?m <p2> ?o }`, a user query of the form `SELECT * { ?s <p1>/<p2> ?o }` or `SELECT * { ?a <p1> [ <p2> ?b ] }` will use the view.

**Bind**: <a id="rewrite-bind"></a> If a query uses a materialized view, either by automatic or explicit use, `BIND` statements can be rewritten to reading additional columns of the view under certain conditions.
For this to work, the `BIND` statements must only define otherwise unused variables and their expressions may only use variables that can't contain `UNDEF` values.
QLever can connect the materialized view and the `BIND` statement across other triples, spatial search and GeoSPARQL filters. 
<!--`UNION`, `FILTER EXISTS`, `MINUS`, other `BIND`s and more will be supported.-->
Note that during query planning a suitable view is selected independently of its ability to rewrite `BIND`s. Therefore if you would like to rewrite different `BIND` statements, it is recommended to define a single view with all the `BIND`s instead of individual views for each `BIND`. This also reduces disk usage and improves performance.

**Limiting the search**: Since the number of candidates in the pattern matching algorithm can grow exponentially in the size of the query, its search is bounded by two runtime parameters (change via `qlever settings`):

- `materialized-view-pattern-match-num-assignments` (default: `100000`): the
  maximum number of candidate variable assignments tried by the backtracking
  algorithm, across all views considered for a given query. Setting this to
  `0` disables pattern-based rewriting entirely.
- `materialized-view-pattern-match-num-replacement-plans` (default: `500`):
  the maximum number of matches (and thus alternative query plans using a
  view) collected for a given query.

**Disabling automatic usage of materialized views**: If you want to disable the automatic usage of materialized views, you can set `qlever settings enable-materialized-view-query-rewrite=false`. This is particularly relevant if you use SPARQL updates, which are not yet supported by materialized views.

## Sort order

Materialized views are sorted by the first column, then the second column, and
then the third column. You should choose the order wisely when creating the
view, for the following reasons:

1. Joining a materialized view with other graph patterns is very efficient 
   when the join column is the first column of the view (like in the example
   above).
2. Range-like filtering on the first column of the view is very efficient. For
   example, if the first column contains literals, retrieving all rows where the
   literal matches a certain prefix is efficient.
3. When fixing certain columns of the view, the following restrictions apply:
   You can either fix the first column, or the first and second column, or the
   first, second, and third column.

## Current limitations

The materialized views feature is still in beta. It works, but there are some
limitations regarding its use. These limitations will be lifted in future
releases of QLever.

1. The query result may not contain so-called local vocabulary entries, that
   is, IRIs or literals that were added by update operations or created by
   functions during query processing, except for integers, floating points,
   booleans, dates, WKT `POINT` literals or encoded numeric IRIs (these are all
   fine).
2. The query to build a view must be a `SELECT` query; we will eventually
   support `CONSTRUCT` queries as well.
3. Materialized views are currently read-only; that is, update operation do
   not modify materialized views. If you need to update a materialized view,
   you must currently recreate it from scratch (you can simply overwrite an
   existing view).
4. Reading from a materialized view always reads the first three columns even
   if they are not requested; the unused ones are discarded immediately.
