QLever has support for a selection of the most relevant features from the [OGC GeoSPARQL standard](https://docs.ogc.org/is/22-047r1/22-047r1.html): see below for a detailed list. Additionally, QLever supports some custom spatial querying features beyond the GeoSPARQL standard, like nearest neighbor search.

## Geometry Preprocessing

QLever can preprocess geometries to accelerate various queries. This can be requested via the option `VOCABULARY_TYPE = on-disk-compressed-geo-split` in the `[index]` section of your `Qleverfile` for use with `qlever index` or the `--vocabulary-type on-disk-compressed-geo-split` argument of `IndexBuilderMain`.

If this option is used, QLever will currently precompute centroid, bounding boxes and geometry types of all WKT literals in the input dataset. These can be used for the respective [GeoSPARQL functions](#geosparql-functions), but also for further optimizations (for example, automatic prefiltering of geometries for more efficient [geometric relation filters](#geosparql-geometric-relations)). More optimizations will be added over time.

*Note:* If you use this option, please expect that you have to rebuild your index multiple times in the coming weeks and months while QLever is being updated to support more GeoSPARQL features efficiently. The server will report an error during startup if an index rebuild is necessary.

## GeoSPARQL Functions

Currently QLever implements these functions from GeoSPARQL:

### `geof:distance`, `geof:metricDistance`

The function `geof:distance(?a, ?b, ?unit)` currently expects two values with `geo:wktLiteral` datatype and optionally a unit of measurement as an IRI or literal with `xsd:anyURI` datatype. Units are expressed using the `qudt` vocabulary as recommended in the GeoSPARQL standard. If no unit is given, the function returns the distance in kilometers. QLever also supports the `geof:metricDistance(?a, ?b)` function, which takes two points like `geof:distance` but always returns meters.

Currently, both functions only support `POINT` literals. They will be extended to other geometry types in the near future.

For a fast distance-based search, please also see [GeoSPARQL Maximum Distance Search](#geosparql-maximum-distance-search) below.

#### Supported Units

- Meters: `http://qudt.org/vocab/unit/M`
- Kilometers: `http://qudt.org/vocab/unit/KiloM`
- Land miles: `http://qudt.org/vocab/unit/MI`

#### Example Query

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX unit: <http://qudt.org/vocab/unit/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * WHERE {
  BIND ("POINT(7.8412948 47.9977308)"^^geo:wktLiteral AS ?a) # Freiburg Central Railway Station
  BIND ("POINT(7.8450491 47.9946000)"^^geo:wktLiteral AS ?b) # Freiburg University Library

  BIND (geof:distance(?a, ?b, unit:M) AS ?d_meters) # 446.363 m
  BIND (geof:distance(?a, ?b, "http://qudt.org/vocab/unit/M"^^xsd:anyURI) AS ?d_meters2) # 446.363 m
  BIND (geof:metricDistance(?a, ?b) AS ?d_meters3) # 446.363 m
  BIND (geof:distance(?a, ?b, unit:KiloM) AS ?d_kilometers) # 0.446363 km
  BIND (geof:distance(?a, ?b, "http://qudt.org/vocab/unit/KiloM"^^xsd:anyURI) AS ?d_kilometers2) # 0.446363 km
  BIND (geof:distance(?a, ?b, unit:MI) AS ?d_miles) # 0.277357 mi
  BIND (geof:distance(?a, ?b, "http://qudt.org/vocab/unit/MI"^^xsd:anyURI) AS ?d_miles2) # 0.277357 mi

  # For backward-compatibility
  BIND (geof:distance(?a, ?b) AS ?d_kilometers3) # 0.446363 km
}
```

### `geof:latitude`, `geof:longitude`

The functions `geof:latitude(?x)` and `geof:longitude(?x)` extract the latitude or longitude coordinate from a valid coordinate point with `geo:wktLiteral` datatype.

#### Example Query

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>

SELECT * WHERE {
  BIND ("POINT(7.8412948 47.9977308)"^^geo:wktLiteral AS ?a) # Freiburg Central Railway Station

  BIND (geof:latitude(?a) AS ?lat) # 47.9977
  BIND (geof:longitude(?a) AS ?lng) # 7.84129
}
```

### `geof:centroid`

The function `geof:centroid` provides the centroid of a WKT literal, as a `POINT` WKT literal.

#### Example Query

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
SELECT * WHERE {
  BIND(geof:centroid("POLYGON((2 4, 4 4, 4 2, 2 2, 2 4))"^^geo:wktLiteral) AS ?c)
  # "POINT(3 3)"^^geo:wktLiteral
}
```

### `geof:envelope`

The function `geof:envelope` provides the bounding box of a WKT literal, as a `POLYGON` WKT literal.

#### Example Query

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
SELECT * {
  BIND(geof:envelope("LINESTRING(2 4, 8 6)"^^geo:wktLiteral) AS ?envelope)
  # Result: "POLYGON((2 4,8 4,8 6,2 6,2 4))"^^geo:wktLiteral
}
```

### `geof:geometryType`

The function `geof:geometryType` returns an `xsd:anyURI` literal containing the identifier of the given WKT literal. For a geometry of a supported type, the type identifier will be one of the following.

- `http://www.opengis.net/ont/sf#Point`
- `http://www.opengis.net/ont/sf#LineString`
- `http://www.opengis.net/ont/sf#Polygon`
- `http://www.opengis.net/ont/sf#MultiPoint`
- `http://www.opengis.net/ont/sf#MultiLineString`
- `http://www.opengis.net/ont/sf#MultiPolygon`
- `http://www.opengis.net/ont/sf#GeometryCollection`

#### Example Query

```sparql
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT * {
  BIND(geof:geometryType("LINESTRING(2 4, 8 6)"^^geo:wktLiteral) AS ?geometryType)
  # Result: "http://www.opengis.net/ont/sf#LineString"^^xsd:anyURI
}
```

### `geof:minX`, `geof:minY`, `geof:maxX` and `geof:maxY`

The functions `geof:minX`, `geof:minY`, `geof:maxX` and `geof:maxY` return the bounding coordinates of the geometry represented by the given WKT literal.

#### Example Query

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
SELECT * {
  BIND("LINESTRING(2 4, 3 3, 6 8)"^^geo:wktLiteral AS ?geometry)
  BIND (geof:minX(?geometry) AS ?minX) # Result: 2
  BIND (geof:minY(?geometry) AS ?minY) # Result: 3
  BIND (geof:maxX(?geometry) AS ?maxX) # Result: 6
  BIND (geof:maxY(?geometry) AS ?maxY) # Result: 8
}
```

## GeoSPARQL Maximum Distance Search

QLever supports each of the following query patterns for a fast maximum distance search:

```sparql
FILTER(geof:distance(?geom1, ?geom2) <= constant)
FILTER(geof:metricDistance(?geom1, ?geom2) <= constant)
FILTER(geof:distance(?geom1, ?geom2, <some-supported-unit-iri>) <= constant)
FILTER(geof:distance(?geom1, ?geom2, "some-supported-unit-iri"^^xsd:anyURI) <= constant)
```

In the *Analysis* view of the QLever UI you can see *Spatial Join* instead of *Cartesian Product Join*, when the optimization is in effect. The GeoSPARQL maximum distance search is a standard syntax method for using the [QLever Spatial Search](#qlever-spatial-search). The custom feature provides more options, for example nearest neighbor search.

The implementation currently has to parse WKT geometries for all geometry types except points. This is being worked on, so you may expect a performance improvement in the future.

*Current quirk:* The maximum distance search (each of the `FILTER` patterns above) supports the WKT geometry types `POINT`, `LINESTRING`, `POLYGON`, `MULTIPOINT`, `MULTILINESTRING`, `MULTIPOLYGON` and `GEOMETRYCOLLECTION`, while the non-optimized `geof:distance` and `geof:metricDistance` implementation only supports `POINT` so far.

### Example Query

All pairs of restaurants within 50 meters of public transport stops:

```sparql
SELECT ?restaurant ?stop ?restaurant_geometry WHERE {
  ?restaurant osmkey:amenity "restaurant" ;
              geo:hasGeometry/geo:asWKT ?restaurant_geometry .
  ?stop osmkey:public_transport "stop_position" ;
        geo:hasGeometry/geo:asWKT ?stop_geometry .
  FILTER (geof:metricDistance(?restaurant_geometry,?stop_geometry) <= 50)
}
```

## GeoSPARQL Geometric Relations

QLever supports each of the following query patterns for a GeoSPARQL geometric relation functions:

```sparql
FILTER (geof:sfIntersects(?geom1, ?geom2))
FILTER (geof:sfContains(?geom1, ?geom2))
FILTER (geof:sfCovers(?geom1, ?geom2))
FILTER (geof:sfCrosses(?geom1, ?geom2))
FILTER (geof:sfTouches(?geom1, ?geom2))
FILTER (geof:sfEquals(?geom1, ?geom2))
FILTER (geof:sfOverlaps(?geom1, ?geom2))
FILTER (geof:sfWithin(?geom1, ?geom2))
```

These GeoSPARQL-compliant filters are a standard syntax method for using the [QLever Spatial Search](#qlever-spatial-search) with `qlss:algorithm` set to `qlss:libspatialjoin` and `qlss:joinType` set appropriately.

*Note:* Currently, the functions stated above are only supported in `FILTER`s between two different variables. Also there may not be multiple filters on the same pair of variables. Otherwise the query processing will return an error. This will be fixed in the near future. Also, the implementation currently has to parse WKT geometries for all geometry types except points. This is being worked on, so you may expect a performance improvement in the future.

### Example Query

This query finds all railway lines crossing a river.

```sparql
SELECT ?river ?rail ?rail_geometry WHERE {
  ?river osmkey:waterway "river" ;
         geo:hasGeometry/geo:asWKT ?river_geometry .
  ?rail osmkey:railway "rail" ;
        geo:hasGeometry/geo:asWKT ?rail_geometry .
  FILTER (geof:sfIntersects(?rail_geometry,?river_geometry))
}
```

Try it: <https://qlever.cs.uni-freiburg.de/osm-planet/FKzeVH>

### Precomputing GeoSPARQL geometric relations using `osm2rdf`

For OpenStreetMap data, geometric relations can be precomputed as part of the dataset (e.g. `ogc:sfContains`, `ogc:sfIntersects`, ... triples) using [`osm2rdf`](https://github.com/ad-freiburg/osm2rdf). Geometries from `osm2rdf` are represented as `geo:wktLiteral`s, which can be addressed by `geo:hasGeometry/geo:asWKT`. `osm2rdf` also provides centroids of objects via `geo:hasCentroid/geo:asWKT` and more, if requested. Please note that the geometric relations are given as triples between the OpenStreetMap entities, not the geometries.

#### Example Query with `osm2rdf`: All Buildings in the City of Freiburg

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX ogc: <http://www.opengis.net/rdf#>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>

SELECT ?osm_id ?hasgeometry WHERE {
  osmrel:62768 ogc:sfContains ?osm_id .
  ?osm_id geo:hasGeometry/geo:asWKT ?hasgeometry .
  ?osm_id osmkey:building [] .
}
```

Try it: <https://qlever.cs.uni-freiburg.de/osm-planet/7cxklb>


## QLever Spatial Search

QLever supports a custom fast spatial search operation for geometries from literals with `geo:wktLiteral` datatype. It can be invoked using a `SERVICE` operation to the IRI `<https://qlever.cs.uni-freiburg.de/spatialSearch/>`. Note that this address is not contacted but only used to activate the feature locally.

A spatial query has the following form:

```sparql
PREFIX qlss: <https://qlever.cs.uni-freiburg.de/spatialSearch/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>

SELECT * WHERE {
  # Arbitrary operations that select ?left_geometry
  ?some_entity geo:hasCentroid/geo:asWKT ?left_geometry .

  SERVICE qlss: {
    _:config  qlss:algorithm qlss:s2 ;
              qlss:left ?left_geometry ;
              qlss:right ?right_geometry ;
              qlss:numNearestNeighbors 2 ;
              qlss:maxDistance 500 ;
              qlss:bindDistance ?dist_left_right ;
              qlss:payload ?payloadA , ?payloadB .
    {
      # Any subquery, that selects ?right_geometry, ?payloadA and ?payloadB
      ?some_other_entity geo:hasCentroid/geo:asWKT ?right_geometry .
      # ...
    }
  }
}
```

The `SERVICE` must include the configuration triples and exactly one group graph pattern that selects the right geometry. If `numNearestNeighbors` is not used, the right geometry may also be provided outside of the `SERVICE` definition.

### Configuration parameters

The following configuration parameters are provided in the `SERVICE` as triples with arbitrary subject. The predicate must be an IRI of the form `<parameter>` or `qlss:parameter`. The parameters `left` and `right` are mandatory. Additionally you must provide search instructions, either `numNearestNeighbors` or `maxDistance` or `joinType`. The remaining parameters are optional.

| Parameter | Domain | Description |
|--|--|--|
| `algorithm` | `<baseline>`, `<s2>`, `<boundingBox>`, `<libspatialjoin>` | The algorithm to use. |
| `left` | variable | The left join table: *"for every [left] geometry ..."*. Must refer to a column with literals of `geo:wktLiteral` datatype. |
| `right` | variable | The right join table: *"... find the closest/all intersecting/... [right] geometries"*.  Must refer to a column with literals of `geo:wktLiteral` datatype. |
| `numNearestNeighbors` | integer | The maximum number of nearest neighbor points from `right` for every point from `left`. Only supported by the `baseline` and `s2` algorithms. |
| `maxDistance` | integer | The maximum distance in meters between points from `left` and `right` to be included in the result. |
| `bindDistance` | variable | An otherwise unbound variable name which will be used to give the distance in kilometers between the result point pairs. |
| `payload` | variable or IRI `<all>` | Variable from the group graph pattern inside the `SERVICE` to be included in the result. `right` is automatically included. This parameter may be repeated to include multiple variables. For all variables use `<all>`. If `right` is given outside of the `SERVICE` do not use this parameter. |
| `joinType` | `<intersects>`, `<covers>`, `<contains>`, `<touches>`, `<crosses>`, `<overlaps>`, `<equals>`, `<within-dist>` | The geometric relation to compute between the `left` and `right` geometries. If `within-dist` is chosen, the `maxDistance` parameter is required. Mandatory when using the `libspatialjoin` algorithm and illegal for all other algorithms.  |

**Note**: The individual algorithms support different subsets of all valid literals of `geo:wktLiteral` datatype. The `libspatialjoin` algorithm supports `POINT`, `LINESTRING`, `POLYGON`, `MULTIPOINT`, `MULTILINESTRING`, `MULTIPOLYGON` and `GEOMETRYCOLLECTION`. The `baseline` and `boundingBox` algorithms support the same literals except `GEOMETRYCOLLECTION`. The `s2` algorithm currently only works with `POINT` literals.

**Note**: Geometries except for points currently need to be parsed for every query leading to longer running times. We are working on it.

### Example: Nearest Neighbors Search: Railway Stations and Supermarkets

This example query calculates the three closest supermarkets to every railway station.

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX qlss: <https://qlever.cs.uni-freiburg.de/spatialSearch/>
SELECT * WHERE {
  ?station osmkey:railway "station" ;
           osmkey:name ?name ;
           geo:hasCentroid/geo:asWKT ?station_geometry .
  
  SERVICE qlss: {
    _:config  qlss:left ?station_geometry ;
              qlss:right ?supermarket_geometry ;
              qlss:numNearestNeighbors 3 .
    {
      ?supermarket osmkey:shop "supermarket" ;
                   geo:hasCentroid/geo:asWKT ?supermarket_geometry .
    }
  }
}
```

Try it: <https://qlever.cs.uni-freiburg.de/osm-planet/OXupEH>

### Example: Intersection: Railway Lines Crossing Rivers

This query returns all railway line segments in Germany intersecting rivers (no matter whether by bridge, tunnel, etc.).

```sparql
PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
PREFIX osmrel: <https://www.openstreetmap.org/relation/>
PREFIX ogc: <http://www.opengis.net/rdf#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX qlss: <https://qlever.cs.uni-freiburg.de/spatialSearch/>

SELECT DISTINCT ?rail ?rail_geometry WHERE {
  osmrel:51477 ogc:sfIntersects ?river .
  ?river osmkey:water "river" .
  ?river geo:hasGeometry/geo:asWKT ?river_geometry .

  SERVICE qlss: {
    _:config qlss:algorithm qlss:libspatialjoin ;
             qlss:left ?river_geometry ;
             qlss:right ?rail_geometry ;
             qlss:payload ?rail ;
             qlss:joinType qlss:intersects .
    {
      osmrel:51477 ogc:sfContains ?rail .
      ?rail osmkey:railway "rail" .
      ?rail geo:hasGeometry/geo:asWKT ?rail_geometry .
    }
  }
}
```

Try it: <https://qlever.cs.uni-freiburg.de/osm-planet/5QvF74>

### Special Predicate `<max-distance-in-meters:m>`

As a shortcut, a special predicate `<max-distance-in-meters:m>` is also supported. The parameter `m` refers to the maximum search radius in meters. It may be used as a triple with the left join variable as subject and the right join variable as object.

#### Example

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
SELECT * WHERE {
  ?a geo:hasCentroid/geo:asWKT ?left_geometry .
  ?left_geometry <max-distance-in-meters:300> ?right_geometry .
  ?b geo:hasCentroid/geo:asWKT ?right_geometry .
}
```

### Deprecated: Special Predicate `<nearest-neighbors:k>` or `<nearest-neighbors:k:m>`

*This feature is deprecated and will produce a warning, due to confusing semantics. Please use the `SERVICE` syntax instead.*

A spatial search for nearest neighbors can be realized using `?left <nearest-neighbors:k:m> ?right`. Please replace `k` and `m` with integers as follows:

- For each point `?left` QLever will output the `k` nearest points from `?right`. Of course, the sets `?left` and `?right` can each be limited using further statements.
- Using the optional integer value `m` a maximum distance in meters can be given that restricts the search radius.

#### Example

```sparql
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
SELECT * WHERE {
  ?a geo:hasCentroid/geo:asWKT ?left_geometry .
  ?left_geometry <nearest-neighbors:2:1000> ?right_geometry .
  ?b geo:hasCentroid/geo:asWKT ?right_geometry .
}
```

## Server Configuration Options

### `spatial-join-max-num-threads`

Using the option `spatial-join-max-num-threads`, the number of threads for a spatial search operation (also GeoSPARQL `FILTER` on maximum distance or geometric relations) can be limited. Setting the option to `0` amounts to taking the number of CPU threads. The default value is `8`, since further threads seem to provide little additional performance gain.

### `spatial-join-prefilter-max-size`

If the special `VOCABULARY_TYPE` for geometries is used (see [Geometry Preprocessing](#geometry-preprocessing)), the inputs from the larger side of a spatial search are automatically prefiltered based on the aggregated bounding box of the inputs from the smaller side. If the aggregated bounding box is very large, the cost for prefiltering can outweigh the savings. Thus prefiltering is disabled at a certain bounding box size. This can be configured using `spatial-join-prefilter-max-size`. By default the limit is `2500` square coordinates. To deactivate prefiltering completely, set this to `0`.