# Math Functions in QLever

This page describes the mathematical functions in QLever. Besides the
functions from the SPARQL 1.1 standard, QLever supports some functions from the
[XPath math namespace](https://www.w3.org/TR/xpath-functions-31/#trigonometry)
and a standard deviation aggregate.

## Standard SPARQL functions

The following numeric functions are standard in SPARQL and therefore supported
in QLever:

| Function | Description |
|--|--|
| `ABS (numeric arg)` | Returns the absolute value of `arg`. |
| `CEIL (numeric arg)` | Returns the smallest integer that is not smaller than `arg`. |
| `FLOOR (numeric arg)` | Returns the largest integer that is not larger than `arg`. |
| `ROUND (numeric arg)` | Rounds `arg` to the nearest integer. Values exactly between two integers are rounded up, for example `ROUND(-2.5)` is `-2`. |
| `RAND ()` | Returns a random number between 0 (inclusive) and 1 (exclusive). |

The same holds for the arithmetic operators `+`, `-`, `*`, `/` and the
aggregates `COUNT`, `SUM`, `AVG`, `MIN` and `MAX`.

## Additional math functions

The following functions are not part of SPARQL 1.1. They are taken from the
XPath math namespace `http://www.w3.org/2005/xpath-functions/math#`, which is
abbreviated with the prefix `math:` below. Each argument must be numeric, for
example `xsd:int`, `xsd:decimal` or `xsd:double`. If an argument is not
numeric, the result is unbound. The result is a `xsd:decimal` literal. Results
that are not a finite number, like the square root of a negative number, are
returned as `"NaN"^^xsd:double`, `"INF"^^xsd:double` or `"-INF"^^xsd:double`.

`math:sqrt(?x)`<a id="math-sqrt"></a>: Returns the square root of `?x`.

`math:pow(?x, ?y)`<a id="math-pow"></a>: Returns `?x` to the power of `?y`.
The result is also a `xsd:decimal` literal if both arguments are integers.

`math:exp(?x)`<a id="math-exp"></a>: Returns *e* to the power of `?x`.

`math:log(?x)`<a id="math-log"></a>: Returns the natural logarithm of `?x`.
The logarithm to another base can be computed by division, for example
`math:log(?x) / math:log(10)` for the logarithm to base 10.

`math:sin(?x)`, `math:cos(?x)`, `math:tan(?x)`<a id="math-trigonometry"></a>:
Return the sine, cosine and tangent of `?x`, which is given in radians.

??? note "Example query for the additional math functions"

    The square root of -1 is not a real number, so the result is `NaN`.

    ```sparql {data-demo-engine="wikidata"}
    PREFIX math: <http://www.w3.org/2005/xpath-functions/math#>
    SELECT * WHERE {
      BIND(math:sqrt(2) AS ?sqrt)
      BIND(math:sqrt(-1) AS ?sqrtNegative)
      BIND(math:pow(2, 10) AS ?pow)
      BIND(math:exp(1) AS ?exp)
      BIND(math:log(1) AS ?log)
      BIND(math:log(1000) / math:log(10) AS ?log10)
      BIND(math:sin(0) AS ?sin)
      BIND(math:cos(0) AS ?cos)
      BIND(math:tan(0.5) AS ?tan)
    }
    ```

The other functions from the XPath math namespace, for example `math:pi`,
`math:log10` or `math:atan2`, are not supported yet.

## Standard deviation

!!! info "History"
    - `STDEV` added by [qlever#1614](https://github.com/ad-freiburg/qlever/pull/1614)
    - `ql:stdev` added by [qlever#3849](https://github.com/ad-freiburg/qlever/pull/3849)

`ql:stdev(?x)`<a id="ql-stdev"></a>: An aggregate that returns the sample
standard deviation of the values of `?x` in each group, that is, the sum of the
squared differences from the mean is divided by the number of values minus one.
The prefix `ql:` stands for `http://qlever.cs.uni-freiburg.de/builtin-functions/`.
Like the standard aggregates, it can be used in the `SELECT` clause, with or
without `GROUP BY`. The result is a `xsd:decimal` literal. For a group with
fewer than two values, the result is `0`. If a value in the group is not
numeric, the result for this group is unbound.

??? note "Example query for `ql:stdev`"

    The populations of the countries in Asia vary the most.

    ```sparql {data-demo-engine="wikidata"}
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX ql: <http://qlever.cs.uni-freiburg.de/builtin-functions/>
    SELECT ?continent ?name (AVG(?population) AS ?avg)
           (ql:stdev(?population) AS ?stdev) WHERE {
      ?country wdt:P31 wd:Q6256 ;
               wdt:P30 ?continent ;
               wdt:P1082 ?population .
      ?continent rdfs:label ?name .
      FILTER (LANG(?name) = "en")
    }
    GROUP BY ?continent ?name
    ORDER BY DESC(?stdev)
    ```

QLever also accepts the keyword `STDEV(?x)` with the same meaning. This keyword
is not standard-conforming and therefore deprecated. Queries using it get a
warning and should use `ql:stdev(?x)` instead.
