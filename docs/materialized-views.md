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
SELECT ?subject ?geometry ?centroid ?area ?length WHERE {
  ?subject geo:hasGeometry/geo:asWKT ?geometry .
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
    ``` bash
    qlever materialized-view $VIEW_NAME "SELECT ... { ... }"
    ```
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

You can optionally preload materialized views. This is required for implicitly rewriting queries to use materialized views.
If you do not apply preloading, views get loaded automatically when they are explicitly used in a query for the first
time. Preloading can be requested via a CLI argument to `qlever-server`, an HTTP request and `libqlever`.


=== "qlever-server"
    ```bash
    qlever-server --preload-materialized-views view1 view2 ...
    # or
    qlever-server -l view1 view2 ...
    ```
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

## Automatic usage of materailized views

In addition to the [explicit query syntax](#querying-a-materialized-view), QLever can use materialized views in queries implicitly. This is possible if both the query used for writing the view as well as the user query contain certain query patterns and the applicable view is loaded (see [Preloading a materialized view](#preloading-a-materialized-view)). Currently, QLever supports the following query patterns:

**Simple join chain**: The materialized view is written with a query of the form

```sparql
SELECT * {
   ?s <p1> ?m .
   ?m <p2> ?o
}
```

and the user query contains the same pattern, or `?s <p1>/<p2> ?o`. This is particularily useful for `geo:hasGeometry/geo:asWKT`.
Note that, while the query using the view may contain any additional graph patterns, the query for writing the view may only contain additional `BIND` statements after the basic graph pattern.

**Bind**: If a query uses a materialized view, either by automatic or explicit use, `BIND` statements can be rewritten to reading additional columns of the view under certain conditions.
For this to work, the `BIND` statements must only define otherwise unused variables and their expressions may only use variables that can't contain `UNDEF` values.
QLever can connect the materialized view and the `BIND` statement across other triples, spatial search and GeoSPARQL filters. Soon also `UNION`, `FILTER EXISTS`, `MINUS`, other `BIND`s and more will be supported.
Note that during query planning a suitable view is selected independently of its ability to rewrite `BIND`s. Therefore if you would like to rewrite different `BIND` statements, it is recommended to define a single view with all the `BIND`s instead of individual views for each `BIND`. This also reduces disk usage and improves performance.

Coming soon: Join stars.

TODO runtime parameter

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
