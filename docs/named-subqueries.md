# Named subqueries

!!! info "History"
    - Added by [qlever#3238](https://github.com/ad-freiburg/qlever/pull/3238)

Many SPARQL queries need the same graph pattern several times. Standard SPARQL
has no way to name a pattern, so the pattern text must be repeated at each use,
and when such patterns build on each other, the repetition multiplies. QLever
therefore provides **named subqueries** as a language extension. In particular,
many of the WDQS and Scholia queries make use of this, via Blazegraph's
proprietary named subqueries; see the [differences to
Blazegraph](#differences-to-blazegraph) below.

A query can define named subqueries between the prologue and the query body via
`WITH %name AS { ... }`, where the body is an arbitrary **group graph pattern**.
The pattern `INCLUDE %name` then stands for the defined pattern and must be the
entire body of a subquery. The `SELECT` clause of that subquery makes explicit
which variables of the pattern become visible in the query, and it can rename
them with the familiar alias syntax. `SELECT *` is not allowed around an
`INCLUDE`. An `INCLUDE` may also be used in a later `WITH` definition, so that
named subqueries can build on each other. Here is an example, which computes
for each country the percentage of its area relative to the total area of all
countries:

```sparql {data-demo-engine="wikidata"}
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
WITH %countries_with_area AS {
  ?country wdt:P31 wd:Q6256 ; wdt:P2046 ?area .
}
SELECT ?country ?name ?area (ROUND(1000 * ?area / ?total) / 10 AS ?perc_of_total) WHERE {
  { SELECT ?country ?area WHERE { INCLUDE %countries_with_area } }
  { SELECT (SUM(?area) AS ?total) WHERE { INCLUDE %countries_with_area } }
  ?country rdfs:label ?name FILTER(LANG(?name) = "en")
}
ORDER BY DESC(?perc_of_total)
```

The feature is pure syntactic sugar. Each `INCLUDE` is expanded at parse time
to a copy of the defined pattern, as if the pattern had been written by hand as
the body of the surrounding subquery. In particular, the query planner remains
free to optimize each occurrence in its context, and the subtree cache makes
sure that identical occurrences are only evaluated once.

Named subqueries are currently only available for queries, not for updates.

## Differences to Blazegraph

QLever's named subqueries deliberately deviate from Blazegraph's, in the
following respects.

1. In QLever, the `WITH` definitions come before the `SELECT`. In Blazegraph,
   they were part of the `SELECT` query, which made the query harder to read.

2. QLever writes `WITH %name AS { ... }`, Blazegraph wrote `WITH { ... } AS
   %name`. The Blazegraph order is more consistent with the `AS` in `BIND` and
   in the alias syntax of SPARQL. But it is much harder to parse for humans. It
   is basically an assignment, where you first see the (potentially very long)
   value and only at the end the name. SQL has the same inconsistency and also
   deliberately puts the name first in its `WITH` clause, for exactly this
   readability reason. So we are in good company.

3. In Blazegraph, the `WITH` defines a subquery. In QLever, it defines a group
   graph pattern, and each `INCLUDE` requires a `SELECT` around it, where
   `SELECT *` is not allowed. This makes it transparent at the `INCLUDE` site
   which variables are introduced. Otherwise, an `INCLUDE` potentially
   introduces a lot of variables, and you have to look at the (potentially
   long) definition to understand which ones. That is a recipe for disaster.

4. In Blazegraph, the named subquery is evaluated once, the result is
   materialized and then used at all `INCLUDE` sites. In QLever, the semantics
   is that of a macro expansion, as explained above. When the same named
   subquery is included in many places, QLever's query planner will typically
   choose an identical plan for each occurrence, in which case the pattern is
   evaluated only once and the cached result is reused. But QLever is free to
   do otherwise if that gives a better overall query plan. You can always force
   the Blazegraph behavior by putting a `{ SELECT ... }` around the group graph
   pattern in the `WITH` definition or by using an equivalent (up to variable
   renaming) `{ SELECT ... }` at each `INCLUDE` site, because subqueries are
   currently an optimization barrier in QLever.
