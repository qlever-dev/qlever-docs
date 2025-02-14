# Demo
This page demonstrates some of mkdocs features.

Code blocks with syntax highlighting are - of course - supported. Many more advanced features are also available: for example annotations:
```sparql
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?name ?population WHERE {
    ?city wdt:P31/wdt:P279* wd:Q515 .
    ?city wdt:P17 wd:Q183 . # (1)!
    ?city wdt:P1082 ?population .
    ?city rdfs:label ?name .
    FILTER (LANG(?name) = "de")
}
ORDER BY DESC(?population)
```

1. `wd:Q183` is the name for Germany
