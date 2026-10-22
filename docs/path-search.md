# Path Search in QLever

The Path Search feature in this SPARQL engine allows users to perform advanced queries
to find paths between sources and targets in a graph. It supports a variety of configurations,
including single or multiple source and target nodes, optional edge properties, and
custom algorithms for path discovery. This feature is accessed using the `SERVICE` keyword
and the service IRI `<https://qlever.cs.uni-freiburg.de/pathSearch/>`.

## Basic Syntax

The general structure of a Path Search query is as follows:

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;  # Specify the algorithm
           pathSearch:source <sourceNode> ;            # Specify the source node(s)
           pathSearch:target <targetNode> ;            # Specify the target node(s)
           pathSearch:pathColumn ?path ;               # Bind the path variable
           pathSearch:edgeColumn ?edge ;               # Bind the edge variable
           pathSearch:start ?start ;                   # Bind the edge start variable
           pathSearch:end ?end ;                       # Bind the edge end variable
    {SELECT * WHERE {
        ?start <predicate> ?end.                       # Define the edge pattern
    }}
  }
}
```

The parameters shown in this example are the following. All of them except
`pathSearch:target` are required.

`pathSearch:algorithm`: Defines the algorithm used to search paths. Currently, only `pathSearch:allPaths` is supported.

`pathSearch:source`: Defines the source node(s) of the search.

`pathSearch:target` (optional): Defines the target node(s) of the search.

`pathSearch:pathColumn`: Defines the variable for the path.

`pathSearch:edgeColumn`: Defines the variable for the edge.

`pathSearch:start`: Defines the variable for the start of the edges.

`pathSearch:end`: Defines the variable for the end of the edges.

The remaining features and parameters are described in the following, each with
an example.

## Multiple Sources or Targets

It is possible to specify a set of sources or targets for the path search, by
simply repeating `pathSearch:source` or `pathSearch:target`.

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source1> ;
          pathSearch:source <source2> ;
          pathSearch:target <target1> ;
          pathSearch:target <target2> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
    {
      SELECT * WHERE {
        ?start <predicate> ?end.
      }
    }
  }
}
```

This query will search for paths between all sources and all targets, i.e.

- (`<source1>`, `<target1>`)
- (`<source1>`, `<target2>`)
- (`<source2>`, `<target1>`)
- (`<source2>`, `<target2>`)

## Pairwise Matching of Sources and Targets

With the parameter `pathSearch:cartesian`, it is possible to specify whether
the search computes the paths from each source to **all targets**, according
to the Cartesian product (as in the previous example), or from each source to
exactly **one target**, paired based on the index, i.e.

- (`<source1>`, `<target1>`)
- (`<source2>`, `<target2>`)

The parameter expects a boolean. The default is `true` (Cartesian product);
the following query uses `false` (pairwise matching).

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source1> ;
          pathSearch:source <source2> ;
          pathSearch:target <target1> ;
          pathSearch:target <target2> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
          pathSearch:cartesian false;
    {
      SELECT * WHERE {
        ?start <predicate> ?end.
      }
    }
  }
}
```

## Source or Target as Variables

You can also bind the source and/or target dynamically using variables. The examples
below use `VALUES` clauses, which can be convenient to specify sources and targets.
However, the source/target variables can also be bound using any regular SPARQL construct.

**Source Variable**

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  VALUES ?source {<source>}
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source ?source ;
          pathSearch:target <target> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
    {
      SELECT * WHERE {
        ?start <p> ?end.
      }
    }
  }
}
```

**Target Variable**

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  VALUES ?target {<target>}
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source> ;
          pathSearch:target ?target ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
    {
      SELECT * WHERE {
        ?start <p> ?end.
      }
    }
  }
}
```

## Edge Properties

With the parameter `pathSearch:edgeProperty`, you can include edge properties
in the path search to further refine the results.

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source> ;
          pathSearch:target <target> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:edgeProperty ?middle ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
    {
      SELECT * WHERE {
        ?start <predicate1> ?middle.
        ?middle <predicate2> ?end.
      }
    }
  }
}
```

This is especially useful for [N-ary relations](https://www.w3.org/TR/swbp-n-aryRelations/). 
Considering the example above, it is possible to query additional relations of `?middle`:

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source> ;
          pathSearch:target <target> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:edgeProperty ?middle ;
          pathSearch:edgeProperty ?edgeInfo ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
    {
      SELECT * WHERE {
        ?start <predicate1> ?middle.
        ?middle <predicate2> ?end.
        ?middle <predicate3> ?edgeInfo.
      }
    }
  }
}
```

This makes it possible to query additional properties of the edge between `?start` and `?end` (such as `?edgeInfo` in the example above).

## Limit the Number of Paths per Target

With the parameter `pathSearch:numPathsPerTarget`, it is possible to limit how
many paths per target are searched and returned. The parameter expects an
integer. For example, if the value is 5, the search will enumerate paths for a
target until 5 paths have been found and ignore all further ones. This is
especially useful if the query uses a lot of memory. In that case, it is
possible to query a limited number of paths to debug where the problem is.

The following query for example will only return one path per source and target pair.
I.e. one path for `(<source1>, <target1>)`, one path for `(<source1>, <target2>)` and so on.

```sparql
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>

SELECT ?start ?end ?path ?edge WHERE {
  SERVICE pathSearch: {
    _:path pathSearch:algorithm pathSearch:allPaths ;
          pathSearch:source <source1> ;
          pathSearch:source <source2> ;
          pathSearch:target <target1> ;
          pathSearch:target <target2> ;
          pathSearch:pathColumn ?path ;
          pathSearch:edgeColumn ?edge ;
          pathSearch:start ?start ;
          pathSearch:end ?end ;
          pathSearch:numPathsPerTarget 1;
    {
      SELECT * WHERE {
        ?start <predicate> ?end.
      }
    }
  }
}
```

## Limit the Depth of the Search

With the parameter `pathSearch:maxDepth`, it is possible to cap the number of
edges in any recorded path. An edge directly out of the source counts as depth
1, so `maxDepth 2` records paths of length one or two and never extends them
further. The parameter expects a non-negative integer; if left unspecified,
the length of the paths is unlimited. Note that this restricts the search
itself, in contrast to filtering on the edge variable, which restricts only
the result.

The following query computes the ancestry of Elizabeth II, up to five
generations back; see
[qlever#2916](https://github.com/ad-freiburg/qlever/issues/2916) for an
extensive discussion of this example.

```sparql {data-demo-engine="wikidata"}
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX pathSearch: <https://qlever.cs.uni-freiburg.de/pathSearch/>
SELECT DISTINCT ?parent ?child ?parent_label ?child_label ?depth WHERE {
  { SERVICE pathSearch: { [
      pathSearch:algorithm pathSearch:allPaths ;
      pathSearch:source wd:Q9682 ;
      pathSearch:pathColumn ?path ;
      pathSearch:edgeColumn ?depth ;
      pathSearch:start ?child ;
      pathSearch:end ?parent ;
      pathSearch:numPathsPerTarget 1 ;
      pathSearch:maxDepth 5 ;
    ] { SELECT * WHERE { ?parent wdt:P40 ?child } }
  } }
  ?parent rdfs:label ?parent_label FILTER (LANG(?parent_label) = "en") .
  ?child rdfs:label ?child_label FILTER (LANG(?child_label) = "en") .
}
ORDER BY ASC(?depth)
```

## Error Handling

The Path Search feature will throw errors in the following scenarios:

- **Missing Start Parameter**: If the `start` parameter is not specified, an error will be raised.
- **Multiple Start or End Variables**: If multiple `start` or `end` variables are defined, an error is raised.
- **Invalid Non-Variable Start/End**: If the `start` or `end` parameter is not bound to a variable, the query will fail.
- **Unsupported Argument**: Arguments other than those listed (like custom user arguments) will cause an error.
- **Non-IRI Predicate**: Predicates must be IRIs. If not, an error will occur.
