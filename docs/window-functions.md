# Window Functions

!!! info "History"
    - Added by [qlever#3848](https://github.com/ad-freiburg/qlever/pull/3848)

QLever can add a column with **row numbers** to the result of a sorted
subquery. Joining such results with each other on the row number gives the
effect of SQL window functions like `LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE`,
and `ROW_NUMBER`, for example `LEAD(?d) OVER (PARTITION BY ?e ORDER BY ?d)`.
Standard SPARQL has neither window functions nor row numbers. Each result with
row numbers is already sorted by its row number column, so these joins don't
need any extra sorting and are very efficient.

## Row numbers

The row numbers are added by a `SERVICE` with the IRI
`<https://qlever.cs.uni-freiburg.de/rowNumber/>`. QLever does not contact this
address, the IRI only activates the feature.

```sparql
PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
SELECT ?n ?e ?d WHERE {
  SERVICE rn: {
    [] rn:bind ?n ;
       rn:offset 0 .
    { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
  }
}
```

The parameters are given as triples with an arbitrary subject, for example
`[]`. The predicate is the name of the parameter, written as `<bind>` or
`rn:bind`.

| Parameter | Domain | Description |
|--|--|--|
| `bind` | variable | Mandatory. The variable to which the row numbers are bound as `xsd:int` values. It must not be selected by the subquery. |
| `offset` | non-negative integer | The row number of the first row. Defaults to `0`. |

Besides the parameters, the `SERVICE` must contain exactly one subquery. This
subquery must have an `ORDER BY` or `INTERNAL SORT BY` clause, and every
variable of this clause must be bound in the subquery. Apart from that, the
subquery may use all features of SPARQL.

*NOTE:* If several rows have the same values for all `ORDER BY` variables,
their order and thus their row numbers are arbitrary. For a deterministic
result, add further variables to the `ORDER BY`.

## SQL window functions

A window function is a join of two row number services with **different
offsets**, on the row number **and** the partition variables. This way, each
row is only joined with a row of the same partition.

The row numbers count through the whole result and do not restart for each
partition. Therefore, the partition variables must come first in the `ORDER BY`
clause, so that the rows of each partition are consecutive.

The examples below use entities `?e` with values `?d` (given by the predicate
`<value>`). They partition by `?e` and sort by `?d`, so their subqueries use
`ORDER BY ?e ?d`.

| SQL | QLever |
|--|--|
| `LAG(?d, k) OVER (PARTITION BY ?e ORDER BY ?d)` | `OPTIONAL` join with a second service with `offset` k |
| `LEAD(?d, k) OVER (PARTITION BY ?e ORDER BY ?d)` | `offset` k on the first service, `OPTIONAL` join with a second service |
| `LAST_VALUE`, argmax per partition | `MINUS` of the rows that have a successor in the same partition |
| `FIRST_VALUE`, argmin per partition | `MINUS` of the rows that have a predecessor in the same partition |
| Top-k per partition | `MINUS` of the rows that have a row of the same partition k rows before them |
| `ROW_NUMBER() OVER (PARTITION BY ?e ORDER BY ?d)` | Subtract the smallest row number of the partition |

??? note "Example for `LAG`"

    For each value of an entity, the previous (that is, next smaller) value of
    the same entity. The second service starts numbering at 1 instead of 0, so
    each row of the first service is joined with the row before it, if both
    belong to the same entity `?e`.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d ?previous WHERE {
      SERVICE rn: {
        [] rn:bind ?n .
        { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
      }
      OPTIONAL {
        SERVICE rn: {
          [] rn:bind ?n ; rn:offset 1 .
          { SELECT ?e ?previous WHERE { ?e <value> ?previous } ORDER BY ?e ?previous }
        }
      }
    }
    ```

??? note "Example for `LEAD`"

    For each value of an entity, the next larger value of the same entity. Like
    `LAG`, but with the offset on the first service, so that each row is joined
    with the row after it.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d ?next WHERE {
      SERVICE rn: {
        [] rn:bind ?n ; rn:offset 1 .
        { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
      }
      OPTIONAL {
        SERVICE rn: {
          [] rn:bind ?n .
          { SELECT ?e ?next WHERE { ?e <value> ?next } ORDER BY ?e ?next }
        }
      }
    }
    ```

??? note "Example for `LAST_VALUE` and argmax"

    For each entity, its largest value (together with all other variables of
    that row). The `MINUS` removes each row that is followed by a row of the
    same entity, which leaves exactly one row per entity. For the argmin, move
    the offset from the first service into the `MINUS`.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d WHERE {
      SERVICE rn: {
        [] rn:bind ?n ; rn:offset 1 .
        { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
      }
      MINUS {
        SERVICE rn: {
          [] rn:bind ?n .
          { SELECT ?e ?next WHERE { ?e <value> ?next } ORDER BY ?e ?next }
        }
      }
    }
    ```

??? note "Example for `FIRST_VALUE`"

    For each value of an entity, the smallest value of the same entity. The
    subquery computes the first row of each entity (like the argmin above),
    which is then joined with all values of the same entity.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d ?first WHERE {
      ?e <value> ?d .
      {
        SELECT ?e ?first WHERE {
          SERVICE rn: {
            [] rn:bind ?n .
            { SELECT ?e ?first WHERE { ?e <value> ?first } ORDER BY ?e ?first }
          }
          MINUS {
            SERVICE rn: {
              [] rn:bind ?n ; rn:offset 1 .
              { SELECT ?e ?previous WHERE { ?e <value> ?previous } ORDER BY ?e ?previous }
            }
          }
        }
      }
    }
    ```

??? note "Example for top-k per group"

    For each entity, its two largest values (k = 2). The `MINUS` with offset k
    removes each row that has a row of the same entity k rows before it, so
    exactly the first k rows of each entity remain.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d WHERE {
      SERVICE rn: {
        [] rn:bind ?n .
        { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e DESC(?d) }
      }
      MINUS {
        SERVICE rn: {
          [] rn:bind ?n ; rn:offset 2 .
          { SELECT ?e ?other WHERE { ?e <value> ?other } ORDER BY ?e DESC(?other) }
        }
      }
    }
    ```

??? note "Example for `ROW_NUMBER` per partition"

    For each value of an entity, its rank among the values of the same entity
    (starting at 1). The rank is the row number minus the smallest row number
    of the same entity, plus 1.

    ```sparql
    PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
    SELECT ?e ?d ?rank WHERE {
      SERVICE rn: {
        [] rn:bind ?n .
        { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
      }
      {
        SELECT ?e (MIN(?n) AS ?first) WHERE {
          SERVICE rn: {
            [] rn:bind ?n .
            { SELECT ?e ?d WHERE { ?e <value> ?d } ORDER BY ?e ?d }
          }
        }
        GROUP BY ?e
      }
      BIND(?n - ?first + 1 AS ?rank)
    }
    ```

## Example on Wikidata

The following query computes, for each sovereign state, the three citizens with
the most sitelinks (articles in the different Wikipedias etc.). Its cost is
essentially sorting the 5.3 million citizens once. In standard SPARQL, the same
result requires comparing each citizen with all citizens of the same country,
which is about 1.2 trillion pairs.

```sparql
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rn: <https://qlever.cs.uni-freiburg.de/rowNumber/>
SELECT ?country ?countryLabel ?person ?personLabel ?sitelinks WHERE {
  SERVICE rn: {
    [] rn:bind ?n .
    {
      SELECT ?country ?person ?sitelinks WHERE {
        ?country wdt:P31 wd:Q3624078 .
        ?person wdt:P27 ?country ; wdt:P31 wd:Q5 ; wikibase:sitelinks ?sitelinks .
      }
      ORDER BY ?country DESC(?sitelinks) ?person
    }
  }
  MINUS {
    SERVICE rn: {
      [] rn:bind ?n ; rn:offset 3 .
      {
        SELECT ?country ?other ?otherSitelinks WHERE {
          ?country wdt:P31 wd:Q3624078 .
          ?other wdt:P27 ?country ; wdt:P31 wd:Q5 ; wikibase:sitelinks ?otherSitelinks .
        }
        ORDER BY ?country DESC(?otherSitelinks) ?other
      }
    }
  }
  OPTIONAL { ?country rdfs:label ?countryLabel . FILTER(LANG(?countryLabel) = "en") }
  OPTIONAL { ?person rdfs:label ?personLabel . FILTER(LANG(?personLabel) = "en") }
}
ORDER BY ?countryLabel DESC(?sitelinks)
```

??? note "The same query in standard SPARQL"

    For each person, count the people of the same country with at least as many
    sitelinks. The size of this join grows quadratically with the number of
    citizens per country.

    ```sparql
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    SELECT ?country ?person ?sitelinks WHERE {
      ?country wdt:P31 wd:Q3624078 .
      ?person wdt:P27 ?country ; wdt:P31 wd:Q5 ; wikibase:sitelinks ?sitelinks .
      ?other wdt:P27 ?country ; wdt:P31 wd:Q5 ; wikibase:sitelinks ?otherSitelinks .
      FILTER(?otherSitelinks >= ?sitelinks)
    }
    GROUP BY ?country ?person ?sitelinks
    HAVING (COUNT(*) <= 3)
    ```

## Performance

The result of the row number service is sorted by the row number, so the joins
above need no further sorting.

If the two subqueries are the same except for the names of their variables,
QLever computes their result only once. This is why the second subquery in the
examples is a copy of the first one in which the variables that are not joined
on are renamed (for example `?d` to `?previous`), instead of a subquery that
selects fewer variables.

## Current limitations

1. The row numbers are not restarted for each partition (see the `ROW_NUMBER`
   example above for a workaround).
2. `RANK`, `DENSE_RANK`, `NTILE`, and aggregates over window frames (like
   running sums) are not directly supported.
3. The `offset` must not be negative. Instead of a negative offset on one
   service, use the corresponding positive offset on the other service, as in
   the `LAG` and `LEAD` examples above.
