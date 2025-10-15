# Compliance with the SPARQL 1.1 standard

Each commit to https://github.com/ad-freiburg/qlever triggers an automatic
conformance test against the W3C's SPARQL 1.1 test suite. The test results for
the current master branch can be found at https://qlever.dev/sparql-conformance-ui .

To find the test results for a specific commit, do the following:

1. Got to https://github.com/ad-freiburg/qlever/commits/master/
2. Click on the #... of the commit you are interested in
3. Search for "sparql-conformance"
4. Click on the link after "Details:"

You can also run the tests yourself, see https://github.com/ad-freiburg/sparql-conformance

## Intended deviations from the standard

When inspecting the test results, you will notice a number of "intended
deviations" (number shown in orange). To show only these deviations, open the
`Select test` dropdown, and in section `Status`, uncheck everything except
`Failed: Intended`. Click on anyone of the tests to see the details for that
test (index file, query file, expected result, actual result).

These deviations are almost entirely due to the fact that QLever currently does
not distinguish between the two types `xsd:int` and `xsd:integer`.
Specifically, QLever always uses `xsd:int` in results, even when the input
literal used `xsd:integer`. In the W3C test suite, all input literals with
integer values use `xsd:integer`.

Note that the only difference between `xsd:int` and `xsd:integer` is that
`xsd:int` is restricted to the range that can be represented by a signed 32-bit
integer, whereas `xsd:integer` can represent arbitrarily large integers. In the
W3C test suite, all integers fit into a signed 32-bit integer. QLever can
represent all integers that fit into a signed 60-bit integer, that is, integers
in the range from -576460752303423488 to 576460752303423487.
