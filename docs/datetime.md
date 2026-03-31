# Date and Time Support in QLever

This page describes which features from the [SEP-0002](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md) are supported in QLever, and how to use them.

## Datatypes
QLever supports the following `xsd` Date/Time datatypes:

| Type | Example | Description |
|--|--|--|
|`xsd:time`|`"09:30:10Z"^^xsd:time`|A time containing hour, minute, and second.|
|`xsd:date`|`"2025-12-24"^^xsd:date`|Simple date containing year, month and day. |
|`xsd:dateTime`|`"2025-12-24T18:11:00Z"^^xsd:dateTime`|Date combined with time (hour, minute, second, and timezone).|
|`xsd:duration`|`"P1Y2M1D"^^xsd:duration`|A time interval that may contain years, months, days and time components (hours, minutes, seconds).|
|`xsd:dayTimeDuration`|`"P2DT4H5M6S"^^xsd:dayTimeDuration`|A time interval consisting of days and time components (hours, minutes, seconds).|
|`xsd:yearMonthDuration`|`"P12Y2M"^^xsd:yearMonthDuration`|A time interval consisting of years and months.| 
|`xsd:gYear`|`"12000"^^xsd:gYear`|A (potentially large) year.|

TODO: time und yearMonthDuration supported?

## Arithmetics

### ==

### !=

### <

### >

### Subtraction

`xsd:date - xsd:date`<a id="date-date"></a>:
Returns the `xsd:dayTimeDuration` between the two dates. The arguments need to be valid dates (e.g. `"2025-02-30"^^xsd:date` is not allowed).

??? note "Example query for `xsd:date - xsd:date`"

    There are 73 days between the two dates.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2
        ((?date1 - ?date2) AS ?differenceInDays)
    WHERE {
        BIND("2020-03-13"^^xsd:date AS ?date1)
        BIND("2019-12-31"^^xsd:date AS ?date2)
    }
    ```

`xsd:date - xsd:dayTimeDuration`<a id="date-dayTimeDuration"></a>:
Returns the `xsd:dateTime` that is the amount of days and the time of the duration earlier than the given date. The first argument needs to be a valid date.

??? note "Example query for `xsd:date - dayTimeDuration`"

    The date X is Y earlier than date Z.

    ```sparql {data-demo-engine="osm-planet"}

    ```

`xsd:date - xsd:yearMonthDuration`<a id="date-yearMonthDuration"></a>: TODO: supported?

`xsd:time - xsd:time`<a id="time-time"></a>: TODO: supported?
`xsd:time - xsd:dayTimeDuration`<a id="time-dayTimeDuration"></a>: TODO: supported?

`xsd:dateTime - xsd:dateTime`<a id="dateTime-dateTime"></a>:

`xsd:dateTime - xsd:dayTimeDuration`<a id="dateTime-dayTimeDuration"></a>:

`xsd:dateTime - xsd:yearMonthDuration`<a id="dateTime-yearMonthDuration"></a>: TODO: supported?


### Addition